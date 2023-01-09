import {APIClient} from '../rest/index.ts';

export function sdk<const T>(builder: (client: APIClient) => T) {
	return builder;
}
