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

	async updateState(state: State) {
		await this.client.patch('/v1/channels/:channel_id/state', state, {
			channel_id: this.channel.id,
		});

		this.channel.state = state;
	}

	async patchState(newState: Partial<State> | ((old: State) => State)) {
		const state =
			typeof newState === 'function'
				? newState(this.channel.state)
				: {...this.channel.state, newState};

		return this.updateState(state);
	}

	async publishMessage(name: string, data: unknown) {
		await this.client.post(
			'/v1/channels/:channel_id/messages',
			{e: name, d: data},
			{channel_id: this.channel.id},
		);
	}
}
