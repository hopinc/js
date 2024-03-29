import {z} from 'zod';

export const presetFormSchema = z.object({
	v: z.literal(1),
	fields: z.array(
		z.object({
			input: z.discriminatedUnion('type', [
				z.object({
					type: z.literal('string'),
					default: z.string().optional(),
					autogen: z.enum(['PROJECT_NAMESPACE', 'SECURE_TOKEN']).optional(),
					max_length: z.number().optional(),
					validator: z.string().optional(),
				}),
				z.object({
					type: z.literal('range'),
					default: z.number().optional(),
					min: z.number(),
					max: z.number(),
					increment: z.number().optional(),
					unit: z.string().optional(),
				}),
			]),
			title: z.string(),
			required: z.boolean().optional().default(false),
			description: z.string().optional(),
			map_to: z.array(
				z.discriminatedUnion('type', [
					z.object({
						type: z.literal('env'),
						key: z.string(),
					}),
					z.object({
						type: z.literal('volume_size'),
					}),
				]),
			),
		}),
	),
});
