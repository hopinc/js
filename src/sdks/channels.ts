import {create} from '@onehop/json-methods';
import type {API, Id} from '../rest/index.ts';
import {sdk} from './create.ts';

/**
 * New state to set to a channel, or a callback function that will produce the new state
 * @public
 */
export type ChannelSetStateAction<T extends API.Channels.AnyStateObject> =
	| T
	| ((oldState: T) => T | Promise<T>);

/**
 * Channels SDK client
 * @public
 */
export const channels = sdk(client => {
	const Channels = create<API.Channels.Channel>().methods({
		async setState<T extends API.Channels.AnyStateObject>(
			state: ChannelSetStateAction<T>,
		) {
			await updateState(this.id, state, 'set');
		},

		async patchState<T extends API.Channels.AnyStateObject>(
			state: ChannelSetStateAction<T>,
		) {
			await updateState(this.id, state, 'patch');
		},

		async subscribeToken(token: Id<'leap_token'>) {
			await channelsSDK.subscribeToken(this.id, token);
		},

		async subscribeTokens(tokens: Id<'leap_token'>[] | Set<Id<'leap_token'>>) {
			await channelsSDK.subscribeTokens(this.id, tokens);
		},

		async publishMessage(name: string, data: unknown) {
			await channelsSDK.publishMessage(this.id, name, data);
		},
	});

	async function updateState<T extends API.Channels.AnyStateObject>(
		channelId: API.Channels.Channel['id'],
		newState: ChannelSetStateAction<T>,
		mode: 'patch' | 'set',
	) {
		let state: API.Channels.AnyStateObject;

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
		 * @param type - The type of the channel to create
		 * @param id - An ID to assign to the channel (optional, set this to `undefined` or `null` if you do not want to specify an ID)
		 * @param project - A project ID (if necessary) to assign this to
		 */
		async create<T extends API.Channels.AnyStateObject>(
			type: API.Channels.ChannelType,
			id?: string | null,
			options?: {state?: T} | null,
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
		 * @param project - An optional project ID if authenticating with a PAT or Bearer
		 */
		async getAll(project?: Id<'project'>) {
			const {channels} = await client.get('/v1/channels', {project});
			return channels.map(Channels.from);
		},

		async subscribeToken(
			channel: API.Channels.Channel | API.Channels.Channel['id'],
			token: Id<'leap_token'>,
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
			tokens: Iterable<Id<'leap_token'>>,
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

		async setState<
			T extends API.Channels.AnyStateObject = API.Channels.AnyStateObject,
		>(
			channel: API.Channels.Channel | API.Channels.Channel['id'],
			state: ChannelSetStateAction<T>,
		) {
			const id = typeof channel === 'object' ? channel.id : channel;
			return updateState(id, state, 'set');
		},

		async patchState<T extends API.Channels.AnyStateObject>(
			channel: API.Channels.Channel | API.Channels.Channel['id'],
			state: ChannelSetStateAction<T>,
		) {
			const id = typeof channel === 'object' ? channel.id : channel;
			return updateState(id, state, 'patch');
		},

		/**
		 * Publishes a new event to a channel
		 *
		 * @param channel - The channel to publish to
		 * @param event - The event name
		 * @param data - The data for this event
		 */
		async publishMessage<T>(
			channel: API.Channels.Channel | API.Channels.Channel['id'],
			event: string,
			data: T,
		) {
			const id = typeof channel === 'object' ? channel.id : channel;

			await client.post(
				'/v1/channels/:channel_id/messages',
				{e: event, d: data},
				{channel_id: id},
			);
		},

		async delete(id: API.Channels.Channel['id']) {
			await client.delete('/v1/channels/:channel_id', undefined, {
				channel_id: id,
			});
		},

		async getStats(id: API.Channels.Channel['id']) {
			const {stats} = await client.get('/v1/channels/:channel_id/stats', {
				channel_id: id,
			});

			return stats;
		},

		tokens: {
			async delete(token: Id<'leap_token'>) {
				await client.delete('/v1/channels/tokens/:token', undefined, {
					token,
				});
			},

			/**
			 * Creates a new channel token for a project
			 *
			 * @param state - The state to set on the token
			 * @param project - The project to attach this token to
			 */
			async create(
				state: API.Channels.AnyStateObject = {},
				project?: Id<'project'>,
			) {
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

			async setState(
				id: Id<'leap_token'>,
				state: API.Channels.ChannelToken['state'],
			) {
				const {token} = await client.patch(
					'/v1/channels/tokens/:token',
					{state},
					{token: id},
				);

				return token;
			},

			async get(id: Id<'leap_token'>) {
				const {token} = await client.get('/v1/channels/tokens/:token', {
					token: id,
				});

				return token;
			},

			async isOnline(idOrToken: Id<'leap_token'> | API.Channels.ChannelToken) {
				if (typeof idOrToken === 'object') {
					return idOrToken.is_online;
				}

				const {token} = await client.get('/v1/channels/tokens/:token', {
					token: idOrToken,
				});

				return token.is_online;
			},

			/**
			 * Publishes a direct message to a single token
			 * @param token - The token to publish a direct message to
			 * @param event - The event name
			 * @param data - The data for this event
			 */
			async publishDirectMessage<T>(
				token: Id<'leap_token'>,
				event: string,
				data: T,
			) {
				await client.post(
					'/v1/channels/tokens/:token/messages',
					{e: event, d: data},
					{token},
				);
			},
		},
	};

	return channelsSDK;
});
