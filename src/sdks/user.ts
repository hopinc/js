import {BaseSDK} from './BaseSDK';

export class User extends BaseSDK {
	getMe() {
		return this.client.get('/v1/users/@me', {});
	}
}
