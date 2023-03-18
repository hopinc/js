import {z} from 'zod';
import {
	ContainerStrategy,
	RestartPolicy,
	RuntimeType,
	VolumeFormat,
} from '../../rest/types/ignite.ts';
import {byteUnits, parseSize, isValidByteString} from '../../util/size.ts';

export const deploymentMetaDataSchema = z.object({
	preset: z.string().optional(),
	next_steps_dismissed: z.boolean().optional(),
	container_port_mappings: z.record(z.string(), z.set(z.string())).optional(),
	created_first_gateway: z.boolean().optional(),
	ignored_boarding: z.boolean().optional(),
	max_container_storage: z.string().optional(),
});

const UNIX_DIR_REGEX = /^\/([a-zA-Z0-9_\-]+\/)*([a-zA-Z0-9_\-]+)$/g;

const MIN_VOLUME_SIZE_BYTES = 1024 * 1024 * 1024;
const MAX_VOLUME_SIZE_BYTES = 500 * 1024 * 1024 * 1024;

const MIN_RAM_SIZE_BYTES = 134217728;

export const volumeFormatSchema = z.nativeEnum(VolumeFormat);

export const volumeSchema = z
	.object({
		fs: volumeFormatSchema,
		size: z
			.string()
			.transform(value => value.toUpperCase())
			.refine(
				isValidByteString,
				`Must be a valid byte string, e.g. 1gb. Supported units are ${byteUnits.join(
					', ',
				)}`,
			)
			.refine(v => {
				try {
					const size = parseSize(v);

					return size >= MIN_VOLUME_SIZE_BYTES && size <= MAX_VOLUME_SIZE_BYTES;
				} catch (err) {
					return false;
				}
			}, `Volume size must be at least 1gb`)
			.transform(v => v.toLowerCase()),
		mountpath: z
			.string()
			.regex(
				UNIX_DIR_REGEX,
				"Must be a valid unix directory path, e.g. '/data'",
			),
	})
	.required();

export const buildSettingsSchema = z.object({
	root_directory: z
		.string()
		.regex(UNIX_DIR_REGEX, "Must be a valid unix directory path, e.g. '/data'")
		.or(
			z
				.string()
				.refine(v => v === '' || v === '/')
				.transform(() => '/'),
		),
});

export const deploymentRuntimeTypeSchema = z.nativeEnum(RuntimeType);

export const containerResourcesSchema = z.object({
	vcpu: z.number().min(0.5).max(16).optional(),
	cpu: z.number().min(0.5).max(16).optional(),
	ram: z
		.string()
		.transform(value => value.toUpperCase())
		.refine(isValidByteString)
		.refine(v => {
			const size = parseSize(v);
			return size >= MIN_RAM_SIZE_BYTES;
		})
		.transform(v => v.toLowerCase()),
});

export const deploymentEnvSchema = z
	.record(z.string().min(1).max(128), z.string())
	.optional();

export const containerStrategySchema = z.nativeEnum(ContainerStrategy);

export const deploymentNameSchema = z
	.string()
	.regex(/^[a-zA-Z0-9-]*$/g, "Must be alphanumeric and can include '-'");

export const restartPolicySchema = z.nativeEnum(RestartPolicy);

export const deploymentConfigSchema = z.object({
	version: z.string().default('2022-12-28'),
	restart_policy: restartPolicySchema
		.optional()
		.default(RestartPolicy.ON_FAILURE),
	type: deploymentRuntimeTypeSchema,
	cmd: z.array(z.string()).optional(),
	image: z.union([
		z.object({
			name: z.string(),
			auth: z
				.object({
					username: z.string(),
					password: z.string(),
				})
				.nullable()
				.optional(),
		}),
		z.object({
			name: z.string().optional(),
			gh_repo: z.object({
				repo_id: z.number(),
				full_name: z.string(),
				branch: z.string(),
			}),
			auth: z.null().optional(),
		}),
	]),
	volume: volumeSchema.optional(),
	env: deploymentEnvSchema,
	entrypoint: z
		.array(z.string())
		.optional()
		.transform(v => (!v?.length ? null : v))
		.nullable(),
	container_strategy: containerStrategySchema
		.optional()
		.default(ContainerStrategy.MANUAL),
	resources: containerResourcesSchema,
});
