import {fetch, Headers, Request} from '../util/fetch.js';
import {ExtractRouteParams} from '../util/index.js';
import {IS_BROWSER} from '../util/constants.js';
import {createURLBuilder} from '../util/urls.js';
import {APIResponse, Endpoints, ErroredAPIResponse} from './endpoints.js';
import {getIdPrefix, Id, Method} from './types/index.js';

export type APIAuthentication = Id<'ptk'> | Id<'bearer'> | Id<'pat'>;

export type APIAuthenticationPrefix = APIAuthentication extends Id<infer T>
	? T
	: never;

export function validateAPIAuthentication(
	auth: string,
): auth is APIAuthenticationPrefix {
	return auth === 'bearer' || auth === 'pat' || auth === 'ptk';
}

export interface APIClientOptions {
	readonly baseUrl: string;
	readonly authentication: APIAuthentication;
}

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

export type Query<Path extends string> = ExtractRouteParams<Path> &
	Record<string, string | number | undefined>;

export class APIClient {
	public static getAuthType(auth: APIAuthentication) {
		const prefix = getIdPrefix(auth);

		if (!validateAPIAuthentication(prefix)) {
			throw new Error(`Invalid authentication type: ${prefix}`);
		}

		return prefix;
	}

	private readonly options;
	private agent: unknown;

	public readonly authType;
	public readonly url;

	constructor(options: APIClientOptions) {
		this.options = options;
		this.authType = APIClient.getAuthType(options.authentication);
		this.url = createURLBuilder(options.baseUrl);
		this.agent = null;
	}

	async get<Path extends Extract<Endpoints, {method: 'GET'}>['path']>(
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

			// @ts-expect-error 2345 Targeting multiple runtimes, this will only work in node
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
			body: body ? JSON.stringify(body) : undefined,
			headers,
			...init,
		});

		return this.executeRequest<T>(request);
	}
}
