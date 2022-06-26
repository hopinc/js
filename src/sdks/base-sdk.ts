import {APIClient} from '../rest/client';

export abstract class BaseSDK {
	protected readonly client: APIClient;

	public constructor(client: APIClient) {
		this.client = client;
	}
}
