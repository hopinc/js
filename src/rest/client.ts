import {IS_BROWSER} from '../util/constants.ts';
import {fetch, Headers, Request} from '../util/fetch.ts';
import type {ExtractRouteParams} from '../util/index.ts';
import {createURLBuilder} from '../util/urls.ts';
import type {APIResponse, Endpoints, ErroredAPIResponse} from './endpoints.ts';
import {getIdPrefix, type Id, type Method} from './types/index.ts';

/**
 * A valid ID prefix supported by the Hop API for authetication
 * @public
 */
export type APIAuthenticationPrefix = 'ptk' | 'bearer' | 'pat';

/**
 * Extract an endpoint from a given method and path
 * @public
 */
export type ExtractEndpoint<
	Method extends string,
	Path extends string,
> = Extract<Endpoints, {path: Path; method: Method}>;

/**
 * Pull all paths for a given method
 * @internal
 */
export type PathsFor<M extends Method> = Extract<
	Endpoints,
	{method: M}
>['path'];

/**
 * All possible authentication ID types
 * @public
 */
export type APIAuthentication = Id<APIAuthenticationPrefix>;

/**
 * Validates that an authentication prefix is valid
 * @param auth - The prefix to validate
 * @returns `true` if the prefix is valid, `false` otherwise
 * @public
 */
export function validateAPIAuthentication(
	auth: string,
): auth is APIAuthenticationPrefix {
	return auth === 'bearer' || auth === 'pat' || auth === 'ptk';
}

/**
 * Options passed to the API client.
 * This will usually come from Hop#constructor in most cases
 * @public
 */
export interface APIClientOptions {
	readonly baseUrl: string;
	readonly authentication: APIAuthentication;
}

/**
 * An error that occurred as a response from the Hop API.
 * @public
 */
export class HopAPIError extends Error {
	public readonly status: number;

	constructor(
		public readonly request: Request,
		public readonly response: Response,
		public readonly data: ErroredAPIResponse,
	) {
		super(data.error.message);

		this.status = response.status;
	}
}

/**
 * Generate a query object that includes typed URL params
 * @public
 */
export type Query<Path extends string> = ExtractRouteParams<Path> &
	Record<string, string | number | undefined>;

/**
 * API Client that is responsible for handling all requests
 * @public
 */
export class APIClient {
	public static getAuthType(auth: APIAuthentication) {
		const prefix = getIdPrefix(auth);

		if (!validateAPIAuthentication(prefix)) {
			throw new Error(`Invalid authentication type: ${prefix}`);
		}

		return prefix;
	}

	private readonly options;
	private agent: import('node:https').Agent | null;

	public readonly authType;
	public readonly url;

	constructor(options: APIClientOptions) {
		this.options = options;
		this.authType = APIClient.getAuthType(options.authentication);
		this.url = createURLBuilder(options.baseUrl);

		// Be careful when using this property. It will only
		// have a value in Node.js environments. This is because
		// we add code at build time
		this.agent = null;
	}

	async get<Path extends PathsFor<'GET'>>(
		path: Path,
		query: Query<Path>,
		init?: RequestInit,
	) {
		return this.request<Extract<Endpoints, {path: Path; method: 'GET'}>['res']>(
			'GET',
			path,
			undefined,
			query,
			init,
		);
	}

	post<Path extends Extract<Endpoints, {method: 'POST'}>['path']>(
		path: Path,
		body: Extract<Endpoints, {path: Path; method: 'POST'}>['body'],
		query: Query<Path>,
		init?: RequestInit,
	) {
		return this.request<
			Extract<Endpoints, {path: Path; method: 'POST'}>['res']
		>('POST', path, body, query, init);
	}

	put<Path extends Extract<Endpoints, {method: 'PUT'}>['path']>(
		path: Path,
		body: Extract<Endpoints, {path: Path; method: 'PUT'}>['body'],
		query: Query<Path>,
		init?: RequestInit,
	) {
		return this.request<Extract<Endpoints, {path: Path; method: 'PUT'}>['res']>(
			'PUT',
			path,
			body,
			query,
			init,
		);
	}

	patch<Path extends Extract<Endpoints, {method: 'PATCH'}>['path']>(
		path: Path,
		body: Extract<Endpoints, {path: Path; method: 'PATCH'}>['body'],
		query: Query<Path>,
		init?: RequestInit,
	) {
		return this.request<
			Extract<Endpoints, {path: Path; method: 'PATCH'}>['res']
		>('PATCH', path, body, query, init);
	}

	delete<Path extends Extract<Endpoints, {method: 'DELETE'}>['path']>(
		path: Path,
		body: Extract<Endpoints, {path: Path; method: 'DELETE'}>['body'],
		query: Query<Path>,
		init?: RequestInit,
	) {
		return this.request<
			Extract<Endpoints, {path: Path; method: 'DELETE'}>['res']
		>('DELETE', path, body, query, init);
	}

	async raw<T>(request: Request) {
		request.headers.set('Authorization', this.options.authentication);

		if (!IS_BROWSER) {
			request.headers.set('User-Agent', 'Hop-API-Client');
		}

		return this.executeRequest<T>(request);
	}

	private async executeRequest<T>(request: Request): Promise<T> {
		if (TSUP_IS_NODE) {
			if (!this.agent) {
				const https = await import('https');
				this.agent = new https.Agent({keepAlive: true});
			}
		}

		const response = await fetch(request, {
			keepalive: true,

			// @ts-expect-error Targeting multiple runtimes, this will only work in node
			agent: this.agent,
		});

		if (
			response.status === 204 ||
			!response.headers.get('Content-Type')?.includes('application/json')
		) {
			// Probably a DELETE request with no body returned, so return undefined here
			// This cast is (prolly) safe because endpoints that return nothing
			// are typed as `Empty`
			return undefined as unknown as T;
		}

		const result = await (response.json() as Promise<APIResponse<T>>).catch(
			(error: Error): ErroredAPIResponse => {
				return {
					success: false,
					error: {
						code: 'local_client_error',
						message: error.message,
					},
				};
			},
		);

		if (!result.success) {
			throw new HopAPIError(request, response, result);
		}

		return result.data;
	}

	private async request<T>(
		method: Method,
		path: string,
		body: unknown,
		query: Record<string, string | number | undefined> = {},
		init: RequestInit = {},
	) {
		const url = this.url(path, query);

		const headers = new Headers({
			...(init?.headers ?? {}),
			Authorization: this.options.authentication,
		});

		if (!IS_BROWSER) {
			headers.set('User-Agent', 'Hop-API-Client');
		}

		// Treat falsy values as valid body
		// only undefined is not
		if (body !== undefined) {
			if (method === 'GET') {
				throw new Error('Cannot send a GET request with a body');
			}

			headers.set('Content-Type', 'application/json');
		}

		const request = new Request(url, {
			method,
			body: body ? JSON.stringify(body) : null,
			headers,
			...init,
		});

		return this.executeRequest<T>(request);
	}
}
