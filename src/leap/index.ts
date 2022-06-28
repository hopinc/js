import {APIClient, Id} from '../rest';
import {Channel, State} from '../rest/types/channels';

type Token = Id<'leap_token'>;

export class LeapChannel {
	private readonly subscriptionCache = new Set<Token>();

	private readonly channel: Channel;
	private readonly client: APIClient;

	constructor(client: APIClient, channel: Channel) {
		this.client = client;
		this.channel = channel;
	}

	async subscribeToken(token: Token) {
		if (this.subscriptionCache.has(token)) {
			return;
		}

		this.subscriptionCache.add(token);

		await this.client.put(
			'/v1/channels/:channel_id/subscribers/:token',
			undefined,
			{channel_id: this.channel.id, token},
		);
	}

	async subscribeTokens(tokens: Token[] | Set<Token>) {
		const promises: Array<Promise<void>> = [];

		for (const subscription of tokens) {
			promises.push(this.subscribeToken(subscription));
		}

		await Promise.allSettled(promises);
	}

	async getAllTokens() {
		const {tokens} = await this.client.get('/v1/channels/:channel_id/tokens', {
			channel_id: this.channel.id,
		});

		return tokens;
	}

	async setState(state: State) {
		await this.client.put('/v1/channels/:channel_id/state', state, {
			channel_id: this.channel.id,
		});

		this.channel.state = state;
	}

	async patchState(newState: State | ((old: State) => State | Promise<State>)) {
		let state: State;

		if (typeof newState === 'function') {
			const {state: oldState} = await this.client.get(
				'/v1/channels/:channel_id/state',
				{channel_id: this.channel.id},
			);

			state = await newState(oldState);
		} else {
			state = newState;
		}

		await this.client.put('/v1/channels/:channel_id/state', state, {
			channel_id: this.channel.id,
		});

		this.channel.state = state;
	}

	async publishMessage(name: string, data: unknown) {
		await this.client.post(
			'/v1/channels/:channel_id/messages',
			{e: name, d: data},
			{channel_id: this.channel.id},
		);
	}
}
