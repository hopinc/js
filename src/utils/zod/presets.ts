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
			]),
			title: z.string(),
			required: z.boolean().optional().default(false),
			description: z.string().optional(),
			map_to: z.array(
				z.object({
					type: z.enum(['env']),
					key: z.string(),
				}),
			),
		}),
	),
});
