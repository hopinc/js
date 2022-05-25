import {ByteString} from '../util';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Tag<T, Name extends string> = T & {
	/**
	 * Mark a type as having a specific name in the API
	 * @internal
	 */
	___tag: Name;
};

/**
 * Hop's API uses ISO 8601 date strings
 */
export type Timestamp = Tag<string, 'timestamp'>;

export const ID_PREFIXES = [
	{
		prefix: 'user',
		description: 'Users',
	},
	{
		prefix: 'team',
		description: 'Teams',
	},
	{
		prefix: 'tm',
		description: 'Team Members',
	},
	{
		prefix: 'role',
		description: 'Roles',
	},
	{
		prefix: 'ti',
		description: 'Team Invite',
	},
	{
		prefix: 'sk',
		description: 'Secret Key',
	},
	{
		prefix: 'pat',
		description: 'Team members personal access token',
	},
	{
		prefix: 'container',
		description: 'Ignite container',
	},
	{
		prefix: 'room',
		description: 'Pipe room',
	},
	{
		prefix: 'deployment',
		description: 'Ignite deployment',
	},
	{
		prefix: 'bearer',
		description: 'Users bearer token',
	},
	{
		prefix: 'skid',
		description: 'Secret key ID',
	},
] as const;

export type IdPrefixes = typeof ID_PREFIXES[number]['prefix'];
export type Id<T extends IdPrefixes> = `${T}_${string}`;
export type AnyId = Id<IdPrefixes>;

export function validateIdPrefix<T extends IdPrefixes = IdPrefixes>(
	prefix: string,
	expect?: T,
): prefix is T {
	if (expect) {
		return prefix === expect;
	}

	return ID_PREFIXES.some(({prefix: p}) => p === prefix);
}

/**
 * Validates that a string is a valid ID
 *
 * @param maybeId A string that might be an id
 * @param prefix Optionally an id prefix to check against
 * @returns true if the string is an id
 */
export function validateId<T extends IdPrefixes = IdPrefixes>(
	maybeId: string,
	prefix?: T,
): maybeId is Id<T> {
	if (!prefix) {
		return ID_PREFIXES.some(({prefix}) => maybeId.startsWith(`${prefix}_`));
	}

	return maybeId.startsWith(prefix);
}

export function getIdPrefix<T extends IdPrefixes>(id: string, expect?: T) {
	if (expect && !validateId(id, expect)) {
		throw new Error(`Expected ${id} to be an id of type ${expect}`);
	}

	const [prefix] = id.split('_');

	if (!prefix || !validateIdPrefix(prefix, expect)) {
		const message = expect
			? `Expected ${id} to be a valid id of type ${expect}`
			: `Expected ${id} to be a valid id. Found prefix \`${prefix}\`.`;

		throw new Error(message);
	}

	return prefix;
}

/**
 * Casts a variable into a string for TypeScript
 * @param id The variable to cast into an id
 * @param prefix The type of id to cast to
 * @returns A valid id string
 *
 * @example
 * ```ts
 * declare function createContainer(id: Id<'container'>): void
 * declare const containerId: string;
 *
 * // Error, string cannot be assigned to Id<'container'>
 * createContainer(containerId);
 *
 * // Successfully casts and compiles
 * createContainer(asId(containerId, 'container'));
 * ```
 */
export function asId<T extends IdPrefixes>(id: string, prefix: T) {
	return id as Id<T>;
}

export const id = asId;

export function assertId<T extends IdPrefixes = IdPrefixes>(
	maybeId: string,
	prefix?: T,
): asserts maybeId is Id<T> {
	if (!validateId(maybeId, prefix)) {
		throw new Error(`Invalid id: ${maybeId}. Expected ${prefix}_{string}`);
	}
}

/**
 * All type information for the entire API
 */
export namespace API {
	export type Empty = void;

	export namespace Users {
		export interface PartialUserTeam {
			/**
			 * The ID of the team
			 */
			id: Id<'team'>;

			/**
			 * The name of the team
			 */
			name: string;

			/**
			 * The time this team was created at
			 */
			created_at: Timestamp;

			/**
			 * An icon for this team
			 */
			icon: string | null;

			/**
			 * The registry namespace for this team
			 */
			namespace: string;
		}

		/**
		 * A user objct
		 */
		export interface User {
			/**
			 * The ID of the user
			 */
			id: Id<'user'>;

			/**
			 * The name of the user
			 */
			name: string;

			/**
			 * The email of the user
			 */
			email: string;
		}

		export interface GET_ME {
			teams: PartialUserTeam[];
			user: User;
		}
	}

	/**
	 * @see https://docs.hop.io/pipe
	 */
	export namespace Pipe {
		export type StreamMetadata = unknown;

		export interface Stream {
			/**
			 * The ID of this stream
			 */
			id: Id<'room'>;

			/**
			 * The name of this room
			 */
			name: string;

			/**
			 * The unix timestamp of when this room was created
			 */
			created_at: Timestamp;
		}

		export interface GET_STREAMS {
			streams: Stream[];
		}

		export interface CREATE_STREAM {
			room: Stream;
		}

		export interface CREATE_JOIN_TOKEN {
			join_token: string;
		}
	}

	/**
	 * @see https://docs.hop.io/teams
	 */
	export namespace Teams {
		export interface Member {
			/**
			 * The ID of the user
			 */
			id: Id<'tm'>;

			/**
			 * The personal access token of this user.
			 * Most characters will be hidden if this is NOT the first time you have seen this token.
			 */
			pat: string;

			/**
			 * The role of this user in the team
			 */
			role: MemberRole;
		}

		export interface MemberRole {
			/**
			 * The ID of the role
			 */
			id: Id<'role'>;

			/**
			 * The name of the role
			 */
			name: string;

			/**
			 * The flags for this role
			 */
			flag: number;
		}

		/**
		 * A secret key for a team
		 */
		export interface SecretKey {
			/**
			 * The Id of the secret key
			 */
			id: Id<'skid'>;

			/**
			 * The key value. This will likely have half of the key obfuscated
			 */
			key: Id<'sk'>;

			/**
			 * The time this secret key was created
			 */
			created_at: Timestamp;
		}

		export interface GET_MEMBERS_ME {
			team_member: Member;
		}

		export interface GET_SECRET_KEYS {
			secret_keys: SecretKey[];
		}

		export type DELETE_SECRET_KEY = Empty;
	}

	/**
	 * @see https://docs.hop.io/ignite
	 */
	export namespace Ignite {
		/**
		 * Runtime types are used to describe the type of a deployment or container
		 */
		export enum RuntimeType {
			/**
			 * Ephemeral deployments/containers are sort of fire and forget. Containers won't restart if they exit but they can still be terminated programatically.
			 */
			EPHEMERAL = 0,

			/**
			 * Persistent deployments/containers will restart if they exit. They can also be started and stopped programmatically.
			 */
			PERSISTENT = 1,
		}

		/**
		 * Container state is relatively self-explanatory. It describes what the container is currently doing.
		 */
		export enum ContainerState {
			/**
			 * The container is pending creation
			 */
			PENDING = 0,

			/**
			 * The container is running
			 */
			RUNNING = 1,

			/**
			 * The container is stopped
			 */
			STOPPED = 2,

			/**
			 * The container's entrypoint failed (e.g. exited with a non-zero exit code)
			 */
			FAILED = 3,

			/**
			 * The container is being deleted
			 */
			TERMINATING = 4,

			/**
			 * The container exited (e.g. with a zero exit code)
			 */
			EXITED = 5,
		}

		/**
		 * Types for supported GPU
		 */
		export enum VgpuType {
			A400 = 'a400',
		}

		export interface Container {
			/**
			 * The ID of the container
			 */
			id: Id<'container'>;
			/**
			 * The time this container was created
			 */
			created_at: Timestamp;

			/**
			 * The type of this container
			 */
			type: RuntimeType;

			/**
			 * The ID of the deployment this container is associated with
			 */
			deployment_id: Id<'deployment'>;

			/**
			 * The state this container is in
			 */
			state: ContainerState;
		}

		export interface Deployment {
			/**
			 * The ID of the deployment
			 */
			id: Id<'deployment'>;

			/**
			 * The name of the deployment
			 */
			name: string;

			/**
			 * The amount of containers this deployment is currently running
			 */
			container_count: number;

			/**
			 * The config for this deployment
			 */
			config: DeploymentConfig;
		}

		// This is a type not an interface so we can make a union
		// when future versions of deployment configs come out
		export type DeploymentConfig = {
			/**
			 * The name of the deployment
			 */
			name: string;

			/**
			 * The type of this deployment
			 */
			type: RuntimeType;

			/**
			 * The version of this config
			 */
			version: '2022-05-17';

			/**
			 * The docker image config for this deployment
			 */
			image: Image;

			/**
			 * Environment variables for this deployment
			 */
			env: Record<string, string>;

			/**
			 * Resources allocated to this deployment
			 */
			resources: Resources;
		};

		/**
		 * Docker image config
		 */
		export interface Image {
			/**
			 * The name of the docker image
			 */
			name: string;

			/**
			 * Authorization required for the registry to access this image
			 * This is not required if you use Hop's own registry.
			 */
			auth?: Auth;
		}

		/**
		 * Docker image registry authorization
		 */
		export interface Auth {
			username: string;
			password: string;
		}

		/**
		 * Resources allocated to a deployment
		 */
		export interface Resources {
			/**
			 * Amount of vCPU to allocate
			 */
			cpu: number;

			/**
			 * Amount of memory to allocate in a readible format
			 * You can use the `parseSize` function to convert this to bytes.
			 */
			ram: ByteString;

			/**
			 * vGPUs to allocate
			 */
			vgpu: Vgpu[];
		}

		/**
		 * Virtual GPU config
		 */
		export interface Vgpu {
			/**
			 * The type of vGPU to allocate
			 */
			type: VgpuType;

			/**
			 * The amount of vGPUs to allocate
			 */
			count: number;
		}

		/**
		 * Logs from a container
		 */
		export interface ContainerLog {
			/**
			 * The timestamp of the log
			 */
			timestamp: Timestamp;

			/**
			 * The log message
			 */
			message: string;

			/**
			 * The level of the log. stderr becomes `error` and stdout becomes `info`
			 */
			level: 'info' | 'error';
		}

		export interface GET_DEPLOYMENT_CONTAINERS {
			containers: Container[];
		}

		export interface CREATE_CONTAINER {
			container: Container;
		}

		export interface GET_DEPLOYMENTS {
			deployments: Deployment[];
		}

		export interface GET_DEPLOYMENT {
			deployment: Deployment;
		}

		export interface GET_CONTAINERS {
			containers: Container[];
		}

		export interface CREATE_DEPLOYMENT {
			deployment: Deployment;
		}

		export type DELETE_DEPLOYMENT = Empty;
		export type DELETE_CONTAINER = Empty;
		export type UPDATE_CONTAINER_STATE = Empty;

		export interface GET_LOGS {
			logs: ContainerLog[];
		}

		export interface SEARCH_DEPLOYMENTS {
			deployment: Deployment;
		}
	}

	export namespace Registry {
		export interface GET_IMAGES {}
	}
}
