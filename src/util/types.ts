export type ExtractRouteParams<T extends string> = string extends T
	? string
	: T extends `${string}:${infer Param}/${infer Rest}`
	? Param | keyof ExtractRouteParams<Rest>
	: T extends `${string}:${infer Param}`
	? Param
	: never;
