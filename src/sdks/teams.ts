import {Id} from '../rest';
import {BaseSDK} from './base-sdk';

export class Teams extends BaseSDK {
	/**
	 * Deletes a secret key from a team. You use the Secret Key ID to delete by
	 *
	 * @param secretKeyId The secret key ID to delete
	 */
	async deleteSecretKey(secretKeyId: Id<'skid'>) {
		await this.client.delete('/v1/teams/secret-keys/:secret_key', undefined, {
			secret_key: secretKeyId,
		});
	}

	/**
	 * Fetch the currently authorized member from a team
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
}
