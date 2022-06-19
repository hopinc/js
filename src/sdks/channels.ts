import {Id} from '../rest';
import {ChannelType} from '../rest/types/channels';
import {BaseSDK} from './base-sdk';

export class Channels extends BaseSDK {
	async create(type: ChannelType, project?: Id<'project'>) {
		if (!project && this.client.authType !== 'ptk') {
			throw new Error(
				'Project must be provided when creating a channel with bearer or PAT auth',
			);
		}

		const {channel} = await this.client.post('/v1/channels', {type}, {project});

		return channel;
	}
}
