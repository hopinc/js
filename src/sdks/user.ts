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
				'You cannot resolve a user from a project token! You must use a Bearer or PAT.',
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

	/**
	 * Creates a PAT for the current user
	 *
	 * @returns The created PAT
	 */
	async createPAT() {
		if (this.client.authType === 'ptk') {
			throw new Error(
				'You cannot create a PAT from a project token! You must use a Bearer or PAT.',
			);
		}

		const {pat} = await this.client.post('/v1/users/@me/pats', undefined, {});

		return pat;
	}
}
