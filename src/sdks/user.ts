import {BaseSDK} from './base-sdk';

export class User extends BaseSDK {
	/**
	 * Gets the current user
	 *
	 * @returns The current user authorized by the SDK.
	 */
	async getMe() {
		if (this.client.authType === 'sk') {
			throw new Error(
				'You cannot resolve a user from a secret key! You must use a bearer or pat token.',
			);
		}

		const {user, projects, project_member_role_map} = await this.client.get(
			'/v1/users/@me',
			{},
		);

		return {user, projects, project_member_role_map};
	}
}
