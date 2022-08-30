import {APIClient} from '../rest/index.js';

export function sdk<T>(builder: (client: APIClient) => T) {
	return builder;
}
