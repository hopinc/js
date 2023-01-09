import {APIClient} from '../rest/index.ts';

// TODO: Add `const T` here when esbuild supports it
export function sdk<T>(builder: (client: APIClient) => T) {
	return builder;
}
