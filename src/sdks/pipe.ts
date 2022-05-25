import {Id} from '../rest';
import {BaseSDK} from './base-sdk';

export class Pipe extends BaseSDK {
	async getStreams(team?: Id<'team'>) {
		if (!team && this.client.authType !== 'sk') {
			throw new Error(
				'You must provide ID team id when using a bearer or pat token.',
			);
		}

		const {streams} = await this.client.get('/v1/pipe/streams', {
			team,
		});

		return streams;
	}
}
