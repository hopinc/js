import type {z} from 'zod';
import type {Hop} from '../../hop.ts';

export type AnyEventsDefinition = Record<string, unknown>;

export function createTypedChannelsEmitter<
	T extends AnyEventsDefinition = AnyEventsDefinition,
>(
	hop: Hop,
	schemas?: {
		[Key in keyof T]: z.Schema<T[Key]>;
	},
) {
	return {
		selectChannel: (channel: string) => ({
			publish: async <K extends keyof T>(
				event: Extract<K, string>,
				data: T[K],
			) => {
				const parsed = (await schemas?.[event].parseAsync(data)) ?? data;

				await hop.channels.publishMessage(channel, event, parsed);
			},
		}),
	};
}
