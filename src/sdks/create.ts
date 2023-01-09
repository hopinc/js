import {APIClient} from '../rest/index.ts';

export function sdk<T>(builder: (client: APIClient) => T) {
	return builder;
}
