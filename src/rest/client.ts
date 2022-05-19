import {blueBright, bold} from 'colorette';
import fetch, {Headers} from 'cross-fetch';
import urlcat from 'urlcat';
import {ExtractRouteParams} from '../util';
import {debug} from '../util/debug';
import {APIResponse, Endpoints} from './endpoints';
import {getIdPrefix, Id, Method} from './types';

export type APIAuthorization = Id<'sk'> | Id<'bearer'> | Id<'pat'>;
export type APIAuthorizationType =
	APIAuthorization extends `${infer T}_${string}` ? T : never;

export interface APIClientOptions {
	baseUrl: string;
	authorization: APIAuthorization;
}

export class HopAPIError extends Error {
	constructor(public readonly status: number, message: string) {
		super(message);
	}
}

export type Query<Path extends string> = ExtractRouteParams<Path> &
	Record<string, string | undefined>;

export class APIClient {
	private readonly options: APIClientOptions;
	public readonly authType: APIAuthorizationType;

	constructor(options: APIClientOptions) {
		this.options = options;
		this.authType = getIdPrefix(options.authorization);

		debug(
			'Creating new',
			this.authType,
			'API client with',
			options.authorization,
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
			Authorization: this.options.authorization,
		});

		if (body) {
			headers.set('Content-Type', 'application/json');
		}

		debug(() => [
			method,
			'to',
			bold(blueBright(path)),
			'with',
			{url, query, headers: Object.fromEntries(headers.entries())},
		]);

		const response = await fetch(url, {
			method,
			body: body ? JSON.stringify(body) : undefined,
			headers,
			...init,
		});

		const result = (await response.json()) as APIResponse<T>;

		if (!result.success) {
			debug(result);

			throw new HopAPIError(response.status, result.error.message);
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
