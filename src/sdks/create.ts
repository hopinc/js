import {APIClient} from '../rest';

export function sdk<T>(builder: (client: APIClient) => T) {
	return builder;
}
