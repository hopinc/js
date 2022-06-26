import fetch, {Headers, Request} from 'cross-fetch';
import urlcat from '../urlcat';
import {ExtractRouteParams} from '../util';
import {IS_BROWSER} from '../util/constants';
import {debug} from '../util/debug';
import {APIResponse, Endpoints, ErroredAPIResponse} from './endpoints';
import {getIdPrefix, Id, Method} from './types';

export type APIAuthentication = Id<'ptk'> | Id<'bearer'> | Id<'pat'>;
export type APIAuthenticationType =
	APIAuthentication extends `${infer T}_${string}` ? T : never;

export function validateAPIAuthentication(
	auth: string,
): auth is APIAuthenticationType {
	return auth === 'bearer' || auth === 'pat' || auth === 'ptk';
}

export interface APIClientOptions {
	baseUrl: string;
	authentication: APIAuthentication;
}

export class HopAPIError extends Error {
	constructor(
		public readonly status: number,
		public readonly request: Request,
		public readonly response: Response,
		public readonly data: ErroredAPIResponse,
	) {
		super(data.error.message);
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

	private readonly options: APIClientOptions;
	public readonly authType: APIAuthenticationType;

	constructor(options: APIClientOptions) {
		this.options = options;
		this.authType = APIClient.getAuthType(options.authentication);

		debug(
			'Creating new',
			this.authType,
			'API client with',
			options.authentication,
		);
	}

	private async request<T>(
		method: Method,
		path: string,
		body: unknown,
		query: Record<string, string> = {},
		init: RequestInit = {},
	): Promise<T> {
		const url = urlcat(this.options.baseUrl, path, query);

		const headers = new Headers({
			...(init?.headers ?? {}),
			Authorization: this.options.authentication,
		});

		if (!IS_BROWSER) {
			headers.set('User-Agent', 'Hop-API-Client');
		}

		// Treat null, false and empty strings as valid body
		if (body !== undefined) {
			headers.set('Content-Type', 'application/json');
		}

		debug(() => [
			method,
			'to',
			path,
			'with',
			{url, query, headers: Object.fromEntries(headers.entries())},
		]);

		const request = new Request(url, {
			method,
			body: body ? JSON.stringify(body) : undefined,
			headers,
			...init,
		});

		const response = await fetch(request);

		const result = (await response.json()) as APIResponse<T>;

		if (('success' in result && !result.success) || 'statusCode' in result) {
			debug('An error occurred', result);
			throw new HopAPIError(response.status, request, response, result);
		}

		return result.data;
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
}
