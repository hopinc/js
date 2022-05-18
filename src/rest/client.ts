import fetch from 'cross-fetch';
import urlcat from 'urlcat';
import {ExtractRouteParams} from '../util';
import {APIResponse, Endpoints} from './endpoints';
import {Id} from './types';

export type APIAuthorization = Id<'sk'> | Id<'bearer'> | Id<'pat'>;
export type APIAuthorizationType =
	APIAuthorization extends `${infer T}_${string}` ? T : never;

export interface APIClientOptions {
	baseUrl: string;
	authorization: APIAuthorization;
}

export class APIClient {
	constructor(private readonly options: APIClientOptions) {}

	private async request<T>(
		method: 'get' | 'post' | 'put' | 'patch' | 'delete',
		path: string,
		body?: unknown,
		query: Record<string, string> = {},
		init: RequestInit = {},
	): Promise<T> {
		const url = urlcat(this.options.baseUrl, path);

		const response = await fetch(url, {
			method,
			body: body ? JSON.stringify(body) : undefined,
			headers: {
				...(init?.headers ?? {}),
				'Authorization': this.options.authorization,
				'Content-Type': 'application/json',
			},
			...init,
		});

		const result = (await response.json()) as APIResponse<T>;

		if (!result.success) {
			throw new Error(result.error.message);
		}

		return result.data;
	}

	async get<Path extends Extract<Endpoints, {method: 'GET'}>['path']>(
		path: Path,
		query?: ExtractRouteParams<Path> & Record<string, string>,
		init?: RequestInit,
	) {
		type E = Extract<Endpoints, {path: Path; method: 'GET'}>;

		const url = urlcat(this.options.baseUrl, path, query ?? {});
		return this.request<E['res']>('get', url, undefined, query, init);
	}

	post<Path extends Extract<Endpoints, {method: 'POST'}>['path']>(
		path: Path,
		body?: Extract<Endpoints, {path: Path; method: 'POST'}>['body'],
		query?: ExtractRouteParams<Path> & Record<string, string>,
		init?: RequestInit,
	) {
		type E = Extract<Endpoints, {path: Path; method: 'POST'}>;

		const url = urlcat(this.options.baseUrl, path);
		return this.request<E['res']>('post', url, body, query, init);
	}

	put<Path extends Extract<Endpoints, {method: 'PUT'}>['path']>(
		path: Path,
		body?: Extract<Endpoints, {path: Path; method: 'PUT'}>['body'],
		query?: ExtractRouteParams<Path> & Record<string, string>,
		init?: RequestInit,
	) {
		type E = Extract<Endpoints, {path: Path; method: 'PUT'}>;

		const url = urlcat(this.options.baseUrl, path);
		return this.request<E['res']>('put', url, body, query, init);
	}

	patch<Path extends Extract<Endpoints, {method: 'PATCH'}>['path']>(
		path: Path,
		body?: Extract<Endpoints, {path: Path; method: 'PATCH'}>['body'],
		query?: ExtractRouteParams<Path> & Record<string, string>,
		init?: RequestInit,
	) {
		type E = Extract<Endpoints, {path: Path; method: 'PATCH'}>;

		const url = urlcat(this.options.baseUrl, path);
		return this.request<E['res']>('patch', url, body, query, init);
	}

	delete<Path extends Extract<Endpoints, {method: 'DELETE'}>['path']>(
		path: Path,
		body?: Extract<Endpoints, {path: Path; method: 'DELETE'}>['body'],
		query?: ExtractRouteParams<Path> & Record<string, string>,
		init?: RequestInit,
	) {
		type E = Extract<Endpoints, {path: Path; method: 'DELETE'}>;

		const url = urlcat(this.options.baseUrl, path, query ?? {});
		return this.request<E['res']>('delete', url, body, query, init);
	}
}
