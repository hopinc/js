import {BaseSDK} from './base-sdk';

export class User extends BaseSDK {
	/**
	 * Gets the current user
	 *
	 * @returns The current user authorized by the SDK.
	 */
	getMe() {
		if (this.client.authType === 'sk') {
			throw new Error(
				'You cannot resolve a user from a secret key! You must use a bearer or pat token.',
			);
		}

		return this.client.get('/v1/users/@me', {});
	}
}
