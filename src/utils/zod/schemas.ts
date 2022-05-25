import {z} from 'zod';
import {API} from '../../rest';
import {ByteString, isValidByteString} from '../../util/size';

export const schemas = {
	deployments: {
		config: z.object({
			name: z.string().min(1).max(20),
			type: z.nativeEnum(API.Ignite.RuntimeType),
			version: z.literal('2022-05-17'),
			image: z.object({
				name: z.string().min(1),
				auth: z.object({username: z.string(), password: z.string()}).optional(),
			}),
			env: z.record(z.string()),
			resources: z.object({
				cpu: z.number().min(0),
				memory: z
					.string()
					.refine((value): value is ByteString => isValidByteString(value)),
				vgpu: z.array(
					z.object({
						type: z.nativeEnum(API.Ignite.VgpuType),
						count: z.number().min(1),
					}),
				),
			}),
		}),
	},
};
