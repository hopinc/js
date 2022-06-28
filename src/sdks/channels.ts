import {Id} from '../rest';
import {ChannelType, State} from '../rest/types/channels';
import {BaseSDK} from './base-sdk';

export class Channels extends BaseSDK {
	/**
	 * Creates a new channel
	 *
	 * @param type The type of the channel to create
	 * @param id An ID to assign to the channel (optional, set this to `undefined` or `null` if you do not want to specify an ID)
	 * @param project A project ID (if necessary) to assign this to
	 */
	async create(
		type: ChannelType,
		id?: Id<'channel'> | null,
		project?: Id<'project'>,
	) {
		if (!project && this.client.authType !== 'ptk') {
			throw new Error(
				'Project must be provided when creating a channel with bearer or PAT auth',
			);
		}

		const {channel} = id
			? await this.client.put(
					'/v1/channels/:channel_id',
					{type},
					{project, channel_id: id},
			  )
			: await this.client.post('/v1/channels', {type}, {project});

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

	/**
	 * Get all channels for a project
	 *
	 * @param project An optional project ID if authenticating with a PAT or Bearer
	 */
	async getAll(project?: Id<'project'>) {
		const {channels} = await this.client.get('/v1/channels', {project});
		return channels;
	}
}
