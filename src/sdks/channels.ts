import {Id} from '../rest';
import {ChannelType, State, Channel} from '../rest/types/channels';
import {BaseSDK} from './base-sdk';

type Token = Id<'leap_token'>;
type SetStateAction = State | ((oldState: State) => State | Promise<State>);

export class Channels extends BaseSDK {
	/**
	 * Creates a new channel
	 *
	 * @param type The type of the channel to create
	 * @param id An ID to assign to the channel (optional, set this to `undefined` or `null` if you do not want to specify an ID)
	 * @param project A project ID (if necessary) to assign this to
	 */
	async create(type: ChannelType, id?: string | null, project?: Id<'project'>) {
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

	async subscribeToken(channel: Channel | Channel['id'], token: Token) {
		const id = typeof channel === 'object' ? channel.id : channel;

		await this.client.put(
			'/v1/channels/:channel_id/subscribers/:token',
			undefined,
			{channel_id: id, token},
		);
	}

	async subscribeTokens(
		channel: Channel | Channel['id'],
		tokens: Token[] | Set<Token>,
	) {
		const promises: Array<Promise<void>> = [];

		for (const subscription of tokens) {
			promises.push(this.subscribeToken(channel, subscription));
		}

		await Promise.allSettled(promises);
	}

	async getAllTokens(channel: Channel['id'] | Channel) {
		const id = typeof channel === 'object' ? channel.id : channel;

		const {tokens} = await this.client.get('/v1/channels/:channel_id/tokens', {
			channel_id: id,
		});

		return tokens;
	}

	private async updateState(
		channelId: Channel['id'],
		newState: SetStateAction,
		mode: 'patch' | 'set',
	) {
		let state: State;

		if (typeof newState === 'function') {
			const {state: oldState} = await this.client.get(
				'/v1/channels/:channel_id/state',
				{channel_id: channelId},
			);

			state = await newState(oldState);
		} else {
			state = newState;
		}

		if (mode === 'patch') {
			await this.client.patch('/v1/channels/:channel_id/state', state, {
				channel_id: channelId,
			});
		} else {
			await this.client.put('/v1/channels/:channel_id/state', state, {
				channel_id: channelId,
			});
		}
	}

	async setState(channel: Channel | Channel['id'], state: SetStateAction) {
		const id = typeof channel === 'object' ? channel.id : channel;
		return this.updateState(id, state, 'set');
	}

	async patchState(channel: Channel | Channel['id'], state: SetStateAction) {
		const id = typeof channel === 'object' ? channel.id : channel;
		return this.updateState(id, state, 'patch');
	}

	async publishMessage(
		channel: Channel | Channel['id'],
		name: string,
		data: unknown,
	) {
		const id = typeof channel === 'object' ? channel.id : channel;

		await this.client.post(
			'/v1/channels/:channel_id/messages',
			{e: name, d: data},
			{channel_id: id},
		);
	}
}
