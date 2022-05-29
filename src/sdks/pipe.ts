import {Id} from '../rest';
import {BaseSDK} from './base-sdk';

export class Pipe extends BaseSDK {
	async getStreams(team?: Id<'team'>) {
		if (!team && this.client.authType !== 'sk') {
			throw new Error(
				'You must provide ID team id when using a bearer or pat token.',
			);
		}

		const {streams} = await this.client.get('/v1/pipe/streams', {team});

		return streams;
	}

	async createJoinToken(
		stream: Id<'stream'>,
		userId: string | number,
		metadata: unknown,
		team?: Id<'team'>,
	) {
		const {join_token: token} = await this.client.post(
			'/v1/pipe/streams/:stream_id/join-token',
			{metadata, user_id: userId},
			{team, stream_id: stream},
		);

		return token;
	}
}
