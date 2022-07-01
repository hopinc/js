import {Id} from '../rest';
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
	async createPAT(name: string) {
		if (this.client.authType === 'ptk') {
			throw new Error(
				'You cannot create a PAT from a project token! You must use a Bearer or PAT.',
			);
		}

		const {pat} = await this.client.post('/v1/users/@me/pats', {name}, {});

		return pat;
	}

	/**
	 * Fetches all PATs for this user
	 *
	 * @returns A list of all pats
	 */
	async getAllPATs() {
		if (this.client.authType === 'ptk') {
			throw new Error(
				'You cannot get all PATs from a project token! You must use a Bearer or PAT.',
			);
		}

		const {pats} = await this.client.get('/v1/users/@me/pats', {});

		return pats;
	}

	/**
	 * Deletes a pat
	 *
	 * @param id The ID of the pat to delete
	 */
	async deletePAT(id: Id<'pat'>) {
		if (this.client.authType === 'ptk') {
			throw new Error(
				'You cannot delete a PAT from a project token! You must use a Bearer or PAT.',
			);
		}

		await this.client.delete(`/v1/users/@me/pats/:pat_id`, undefined, {
			pat_id: id,
		});
	}
}
