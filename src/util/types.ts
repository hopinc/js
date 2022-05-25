export type ExtractRouteParams<T extends string> = string extends T
	? Record<string, string>
	: T extends `${string}:${infer Param}/${infer Rest}`
	? {[k in Param | keyof ExtractRouteParams<Rest>]: string}
	: T extends `${string}:${infer Param}`
	? {[k in Param]: string}
	: {};

export type Values<T> = T[keyof T];
