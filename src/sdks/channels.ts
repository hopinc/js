import {create} from '@onehop/json-methods';
import {API, Id} from '../rest/index.js';
import {sdk} from './create.js';

type Token = Id<'leap_token'>;

/**
 * New state to set to a channel, or a callback function that will produce the new state
 */
export type SetStateAction<T extends API.Channels.State> =
	| T
	| ((oldState: T) => T | Promise<T>);

export const channels = sdk(client => {
	const Channels = create<API.Channels.Channel>().methods({
		async setState<T extends API.Channels.State>(state: SetStateAction<T>) {
			await updateState(this.id, state, 'set');
		},

		async patchState<T extends API.Channels.State>(state: SetStateAction<T>) {
			await updateState(this.id, state, 'patch');
		},

		async subscribeToken(token: Token) {
			await channelsSDK.subscribeToken(this.id, token);
		},

		async subscribeTokens(tokens: Token[] | Set<Token>) {
			await channelsSDK.subscribeTokens(this.id, tokens);
		},

		async publishMessage(name: string, data: unknown) {
			await channelsSDK.publishMessage(this.id, name, data);
		},
	});

	async function updateState<T extends API.Channels.State>(
		channelId: API.Channels.Channel['id'],
		newState: SetStateAction<T>,
		mode: 'patch' | 'set',
	) {
		let state: API.Channels.State;

		if (typeof newState === 'function') {
			const {state: oldState} = await client.get(
				'/v1/channels/:channel_id/state',
				{channel_id: channelId},
			);

			state = await newState(oldState as T);
		} else {
			state = newState;
		}

		if (mode === 'patch') {
			await client.patch('/v1/channels/:channel_id/state', state, {
				channel_id: channelId,
			});
		} else {
			await client.put('/v1/channels/:channel_id/state', state, {
				channel_id: channelId,
			});
		}
	}

	const channelsSDK = {
		/**
		 * Creates a new channel
		 *
		 * @param type The type of the channel to create
		 * @param id An ID to assign to the channel (optional, set this to `undefined` or `null` if you do not want to specify an ID)
		 * @param project A project ID (if necessary) to assign this to
		 */
		async create(
			type: API.Channels.ChannelType,
			id?: string | null,
			options?: {state?: Record<string, any>} | null,
			project?: Id<'project'>,
		) {
			if (!project && client.authType !== 'ptk') {
				throw new Error(
					'Project must be provided when creating a channel with bearer or PAT auth',
				);
			}

			const {channel} = id
				? await client.put(
						'/v1/channels/:channel_id',
						{type, state: options?.state ?? {}},
						{project, channel_id: id},
				  )
				: await client.post(
						'/v1/channels',
						{type, state: options?.state ?? {}},
						{project},
				  );

			return Channels.from(channel);
		},

		async get(id: API.Channels.Channel['id']) {
			const {channel} = await client.get('/v1/channels/:channel_id', {
				channel_id: id,
			});

			return Channels.from(channel);
		},

		/**
		 * Get all channels for a project
		 *
		 * @param project An optional project ID if authenticating with a PAT or Bearer
		 */
		async getAll(project?: Id<'project'>) {
			const {channels} = await client.get('/v1/channels', {project});
			return channels.map(Channels.from);
		},

		async subscribeToken(
			channel: API.Channels.Channel | API.Channels.Channel['id'],
			token: Token,
		) {
			const id = typeof channel === 'object' ? channel.id : channel;

			await client.put(
				'/v1/channels/:channel_id/subscribers/:token',
				undefined,
				{channel_id: id, token},
			);
		},

		async subscribeTokens(
			channel: API.Channels.Channel | API.Channels.Channel['id'],
			tokens: Token[] | Set<Token>,
		) {
			const promises: Array<Promise<void>> = [];

			for (const subscription of tokens) {
				promises.push(this.subscribeToken(channel, subscription));
			}

			await Promise.allSettled(promises);
		},

		async getAllTokens(
			channel: API.Channels.Channel['id'] | API.Channels.Channel,
		) {
			const id = typeof channel === 'object' ? channel.id : channel;

			const {tokens} = await client.get('/v1/channels/:channel_id/tokens', {
				channel_id: id,
			});

			return tokens;
		},

		async setState<T extends API.Channels.State = API.Channels.State>(
			channel: API.Channels.Channel | API.Channels.Channel['id'],
			state: SetStateAction<T>,
		) {
			const id = typeof channel === 'object' ? channel.id : channel;
			return updateState(id, state, 'set');
		},

		async patchState<T extends API.Channels.State>(
			channel: API.Channels.Channel | API.Channels.Channel['id'],
			state: SetStateAction<T>,
		) {
			const id = typeof channel === 'object' ? channel.id : channel;
			return updateState(id, state, 'patch');
		},

		async publishMessage(
			channel: API.Channels.Channel | API.Channels.Channel['id'],
			name: string,
			data: unknown,
		) {
			const id = typeof channel === 'object' ? channel.id : channel;

			await client.post(
				'/v1/channels/:channel_id/messages',
				{e: name, d: data},
				{channel_id: id},
			);
		},

		tokens: {
			/**
			 * Creates a new channel token for a project
			 *
			 * @param state The state to set on the token
			 * @param project The project to attach this token to
			 */
			async create(state: API.Channels.State, project?: Id<'project'>) {
				if (!project && client.authType !== 'ptk') {
					throw new Error(
						'Project must be provided when creating a channel token with bearer or PAT auth',
					);
				}

				const {token} = await client.post(
					'/v1/channels/tokens',
					{state},
					{project},
				);

				return token;
			},
		},
	};

	return channelsSDK;
});
