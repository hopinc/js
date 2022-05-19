import {APIAuthorization, APIClient} from '../rest/client';
import {DEFAULT_BASE_URL} from '../util/constants';

export abstract class BaseSDK {
	protected readonly client: APIClient;

	public constructor(
		authorization: APIAuthorization,
		baseUrl = DEFAULT_BASE_URL,
	) {
		this.client = new APIClient({
			authorization,
			baseUrl,
		});
	}
}
