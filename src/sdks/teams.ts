import {Id} from '../rest';
import {BaseSDK} from './base-sdk';

export class Teams extends BaseSDK {
	/**
	 * Deletes a secret key by its ID
	 *
	 * @param secretKeyId The ID of the secret key to delete
	 */
	async deleteSecretKey(secretKeyId: Id<'skid'>) {
		await this.client.delete('/v1/teams/secret-keys/:secret_key', undefined, {
			secret_key: secretKeyId,
		});
	}

	/**
	 * Get all secret keys for a team
	 *
	 * @param teamId The team to fetch secrets for
	 * @returns An array of all secrets for the team
	 */
	async getSecretKeys(teamId?: Id<'team'>) {
		if (this.client.authType !== 'sk' && !teamId) {
			throw new Error('Team ID is required for bearer or PAT authorization');
		}

		if (!teamId) {
			const {secret_keys: keys} = await this.client.get(
				'/v1/teams/@this/secret-keys',
				{},
			);

			return keys;
		}

		const {secret_keys: keys} = await this.client.get(
			'/v1/teams/:team_id/secret-keys',
			{team_id: teamId},
		);

		return keys;
	}

	/**
	 * Fetch the currently authorized member from a team.
	 * You cannot use this route if you are authorizing with a secret key as there is no user attached to it.
	 *
	 * @param teamId The team ID to fetch a member from
	 * @returns The member authorized by the SDK
	 */
	async getCurrentMember(teamId: Id<'team'>) {
		if (this.client.authType === 'sk') {
			throw new Error(
				'You cannot resolve a member from a secret key! You must use a bearer or pat token',
			);
		}

		const {team_member: member} = await this.client.get(
			'/v1/teams/:team_id/members/@me',
			{team_id: teamId},
		);

		return member;
	}

	async getAllMembers(teamId?: Id<'team'>) {
		if (this.client.authType !== 'sk' && !teamId) {
			throw new Error(
				'Team ID is required for bearer or PAT authorization to fetch all team members',
			);
		}

		if (teamId) {
			const {members} = await this.client.get('/v1/teams/:team_id/members', {
				team_id: teamId,
			});

			return members;
		}

		const {members} = await this.client.get('/v1/teams/@this/members', {});

		return members;
	}
}
