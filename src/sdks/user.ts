import {BaseSDK} from './base-sdk';

export class User extends BaseSDK {
	/**
	 * Gets the current user
	 *
	 * @returns The current user authorized by the SDK.
	 */
	async getMe() {
		if (this.client.authType === 'ptk') {
			throw new Error(
				'You cannot resolve a user from a project token! You must use a bearer or pat token.',
			);
		}

		const {project_member_role_map, ...rest} = await this.client.get(
			'/v1/users/@me',
			{},
		);

		return {
			...rest,
			projectMemberRoleMap: project_member_role_map,
		};
	}
}
