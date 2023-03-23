import {z} from 'zod';
import type {AnyStateObject, Id, Hop, sdks} from '../../index.ts';

export type AnyEventsDefinition = Record<string, unknown>;

export type StateClientDefinition<State> = {
	schema:
		| z.ZodObject<{
				[Key in keyof State]: z.Schema<State[Key]>;
		  }>
		| undefined;
};

export type EventsClientDefinition<Events> = {
	schemas:
		| {
				[Key in keyof Events]: z.Schema<Events[Key]>;
		  }
		| undefined;
};

export namespace typedChannelsClient {
	export function create<
		State extends AnyStateObject,
		Events extends AnyEventsDefinition,
	>(
		hop: Hop,
		stateDefinition: StateClientDefinition<State>,
		eventsDefinition: EventsClientDefinition<Events>,
	) {
		return {
			selectChannel: (channel: string) => ({
				publish: async <K extends keyof Events>(
					event: Extract<K, string>,
					data: Events[K],
				) => {
					const parsed =
						(await eventsDefinition.schemas?.[event].parseAsync(data)) ?? data;

					return hop.channels.publishMessage(channel, event, parsed);
				},

				delete: async () => {
					return hop.channels.delete(channel);
				},

				subscribeTokens: async (tokens: Iterable<Id<'leap_token'>>) => {
					return hop.channels.subscribeTokens(channel, tokens);
				},

				setState: async (state: sdks.ChannelSetStateAction<State>) => {
					if (stateDefinition.schema) {
						const parsed = await stateDefinition.schema.parseAsync(state);
						return hop.channels.setState(channel, parsed);
					}

					return hop.channels.setState(channel, state);
				},

				patchState: async (state: sdks.ChannelSetStateAction<State>) => {
					if (stateDefinition.schema) {
						const parsed = await stateDefinition.schema
							.partial()
							.parseAsync(state);

						return hop.channels.setState(channel, parsed);
					}

					return hop.channels.patchState(channel, state);
				},
			}),
		};
	}

	export function state<T extends AnyStateObject = AnyStateObject>(
		schema?: z.ZodObject<{
			[Key in keyof T]: z.Schema<T[Key]>;
		}>,
	): StateClientDefinition<T> {
		return {
			schema,
		};
	}

	export function events<
		T extends AnyEventsDefinition = AnyEventsDefinition,
	>(schemas?: {
		[Key in keyof T]: z.Schema<T[Key]>;
	}) {
		return {schemas};
	}
}

declare const hop: Hop;

const client = typedChannelsClient.create(
	hop,
	typedChannelsClient.state<{name: string}>(),
	typedChannelsClient.events<{
		CREATE_MESSAGE: {
			content: string;
		};
	}>({
		CREATE_MESSAGE: z.object({
			content: z.string(),
		}),
	}),
);

const messages = client.selectChannel('messages');

await messages.publish('CREATE_MESSAGE', {
	content: 'Hello world',
});
