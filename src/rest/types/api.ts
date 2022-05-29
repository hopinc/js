import {Id, Timestamp} from './types';
import * as Pipe from './pipe';
import * as Users from './users';

export {Pipe, Users};

export type Empty = void;

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
		EPHEMERAL = 'ephemeral',

		/**
		 * Persistent deployments/containers will restart if they exit. They can also be started and stopped programmatically.
		 */
		PERSISTENT = 'persistent',
	}

	/**
	 * Container state is relatively self-explanatory. It describes what the container is currently doing.
	 */
	export enum ContainerState {
		/**
		 * The container is pending creation
		 */
		PENDING = 'pending',

		/**
		 * The container is running
		 */
		RUNNING = 'running',

		/**
		 * The container is stopped
		 */
		STOPPED = 'stopped',

		/**
		 * The container's entrypoint failed (e.g. exited with a non-zero exit code)
		 */
		FAILED = 'failed',

		/**
		 * The container is being deleted
		 */
		TERMINATING = 'terminating',

		/**
		 * The container exited (e.g. with a zero exit code)
		 */
		EXITED = 'exited',
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
