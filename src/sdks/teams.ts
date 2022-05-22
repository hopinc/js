import {Id} from '../rest';
import {BaseSDK} from './base-sdk';

export class Teams extends BaseSDK {
	async deleteSecretKey(teamId: Id<'team'>, secretKey: Id<'sk'>) {
		await this.client.delete(
			'/v1/teams/:team_id/secret-keys/:secret_key',
			undefined,
			{team_id: teamId, secret_key: secretKey},
		);
	}

	async getCurrentMember(teamId: Id<'team'>) {
		if (this.client.authType === 'sk') {
			throw new Error(
				'You must specify a team ID when using bearer or PAT authorization',
			);
		}

		const {team_member: member} = await this.client.get(
			'/v1/teams/:team_id/members/@me',
			{team_id: teamId},
		);

		return member;
	}
}
