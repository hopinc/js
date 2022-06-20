import {Id} from '../rest';
import {ChannelType, State} from '../rest/types/channels';
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

	/**
	 * Creates a new channel token for a project
	 *
	 * @param state The state to set on the token
	 * @param project The project to attach this token to
	 */
	async createToken(state: State, project?: Id<'project'>) {
		if (!project && this.client.authType !== 'ptk') {
			throw new Error(
				'Project must be provided when creating a channel token with bearer or PAT auth',
			);
		}

		const {token} = await this.client.post(
			'/v1/channels/tokens',
			{state},
			{project},
		);

		return token;
	}
}
