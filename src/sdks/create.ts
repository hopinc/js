import {APIClient} from '../rest';

export function sdk<T>(callback: (client: APIClient) => T) {
	return callback;
}
