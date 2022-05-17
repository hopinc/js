import fetch, {RequestInit} from 'node-fetch';
import urlcat from 'urlcat';
import {APIResponse, ErroredAPIResponse} from './endpoints';

export interface Methods {
	get<T>(
		path: string,
		query?: Record<string, string>,
		init?: RequestInit,
	): Promise<T>;

	post<T>(
		path: string,
		body?: unknown,
		query?: Record<string, string>,
		init?: RequestInit,
	): Promise<T>;

	put<T>(
		path: string,
		body?: unknown,
		query?: Record<string, string>,
		init?: RequestInit,
	): Promise<T>;

	patch<T>(
		path: string,
		body?: unknown,
		query?: Record<string, string>,
		init?: RequestInit,
	): Promise<T>;

	delete<T>(
		path: string,
		body?: unknown,
		query?: Record<string, string>,
		init?: RequestInit,
	): Promise<T>;
}

export type APIAuthorization = {type: 'console' | 'sk'; token: string};

export interface APIClientOptions {
	baseUrl: string;
	authorization: APIAuthorization;
}

export class APIClient implements Methods {
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
				'Authorization':
					this.options.authorization.type === 'console'
						? `Bearer ${this.options.authorization.token}`
						: `Secret ${this.options.authorization.token}`,
				'Content-Type': 'application/json',
			},
			...init,
		});

		const result = (await response.json()) as APIResponse<T>;

		if (!result.success) {
			const {error} = body as ErroredAPIResponse;
			throw new Error(error.message);
		}

		if ('data' in result) {
			return result.data;
		}

		// Return nothing but cast to never
		return undefined as never;
	}

	async get<T>(
		path: string,
		query?: Record<string, string>,
		init?: RequestInit,
	): Promise<T> {
		const url = urlcat(this.options.baseUrl, path, query ?? {});
		return this.request<T>('get', url, undefined, query, init);
	}

	post<T>(
		path: string,
		body?: unknown,
		query?: Record<string, string>,
		init?: RequestInit,
	): Promise<T> {
		const url = urlcat(this.options.baseUrl, path);
		return this.request<T>('post', url, body, query, init);
	}

	put<T>(
		path: string,
		body?: unknown,
		query?: Record<string, string>,
		init?: RequestInit,
	): Promise<T> {
		const url = urlcat(this.options.baseUrl, path);
		return this.request<T>('put', url, body, query, init);
	}

	patch<T>(
		path: string,
		body?: unknown,
		query?: Record<string, string>,
		init?: RequestInit,
	): Promise<T> {
		const url = urlcat(this.options.baseUrl, path);
		return this.request<T>('patch', url, body, query, init);
	}

	delete<T>(
		path: string,
		body?: unknown,
		query?: Record<string, string>,
		init?: RequestInit,
	): Promise<T> {
		const url = urlcat(this.options.baseUrl, path);
		return this.request<T>('delete', url, body, query, init);
	}
}
