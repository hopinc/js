import {ByteString} from '../../util/index.js';
import {Endpoint} from '../endpoints.js';
import {
	Empty,
	HopShDomain,
	Id,
	InternalHopDomain,
	Timestamp,
} from '../../util/types.js';

export enum Regions {
	US_EAST_1 = 'us-east-1',
}

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
 * Restart policy for deployments
 */
export enum RestartPolicy {
	NEVER = 'never',
	ALWAYS = 'always',
	ON_FAILURE = 'on-failure',
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
	 * The region this container runs in
	 */
	region: Regions;

	/**
	 * Information about uptime/downtime for this container
	 */
	uptime: {
		/**
		 * The last time this container was started at
		 */
		last_start: Timestamp;
	};

	metadata: {
		last_exit_code?: number;
	};

	/**
	 * The type of this container
	 */
	type: RuntimeType;

	/**
	 * The internal IP of the container
	 */
	internal_ip: string;

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
	 * The time this deployment was created at
	 */
	created_at: Timestamp;

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
	 * The strategy for scaling multiple containers.
	 *
	 * Manual = add containers yourself
	 *
	 * @warning This property is not yet fully complete
	 */
	container_strategy: 'manual';

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

	/**
	 * Restart policy for this deployment
	 */
	restart_policy: RestartPolicy;
};

/**
 * Docker image config
 */
export interface Image {
	/**
	 * The name of the docker image
	 */
	name: string | null;

	/**
	 * Authorization required for the registry to access this image
	 * This is not required if you use Hop's own registry.
	 */
	auth: Auth | null;

	/**
	 * GitHub repo information (if applicable)
	 */
	gh_repo: ImageGHRepo | null;
}

/**
 * Docker image registry authorization
 */
export interface Auth {
	username: string;
	password: string;
}

/**
 * GitHub repo type sent from API (NOT USED IN IMAGES)
 */
export interface GHRepo {
	id: number;
	full_name: string;
	private: boolean;
	default_branch: string;
	account_name: string;
}

/**
 * GitHub repo partial used for images
 */
export interface ImageGHRepo {
	repo_id: number;
	full_name: string;
	branch: string;
}

/**
 * Resources allocated to a deployment
 */
export interface Resources {
	/**
	 * Amount of vCPU to allocate
	 */
	vcpu: number;

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
	 * The ID of the document in elasticsearch. You probably won't have to use this, but
	 * it might be useful for React keys, for example, as they are unique.
	 */
	nonce: string;

	/**
	 * The level of the log. stdout becomes `info`
	 */
	level: 'info' | 'stderr';
}

/**
 * Types of gateways supported by Hop
 */
export enum GatewayType {
	/**
	 * The gateway can only be accessed inside of a project's network
	 */
	INTERNAL = 'internal',

	/**
	 * The gateway can be accessed from the internet
	 */
	EXTERNAL = 'external',
}

/**
 * Gateways are used to connect services to the internet or a private network
 */
export interface Gateway {
	/**
	 * The ID of the gateway
	 */
	id: Id<'gateway'>;

	/**
	 * The type of the gateway
	 */
	type: GatewayType;

	/**
	 * The name of the gateway
	 */
	name: string;

	/**
	 * The protocol for this gateway (Only for external)
	 *
	 * @warning Currently, hop only supports HTTP. This will eventually change to an enum
	 */
	protocol: 'http' | null;

	/**
	 * The deployment this gateway is associated with
	 */
	deployment_id: Id<'deployment'>;

	/**
	 * The date this gateway was created
	 */
	created_at: Timestamp;

	/**
	 * Domain automatically assigned by Hop
	 */
	hopsh_domain: HopShDomain | null;

	/**
	 * Internal domain assigned by user upon gateway creation
	 */
	internal_domain: InternalHopDomain | null;

	/**
	 * Port the Gateway targets (Only for external gateways)
	 */
	target_port: number | null;

	/**
	 * Domains associated with this gateway
	 */
	domains: Domain[];
}

export enum DomainState {
	PENDING = 'pending',
	VALID_CNAME = 'valid_cname',
	SSL_ACTIVE = 'ssl_active',
}

export interface Domain {
	/**
	 * The ID of the domain
	 */
	id: Id<'domain'>;

	/**
	 * The domain name
	 */
	domain: string;

	/**
	 * The domain state
	 */
	state: DomainState;

	/**
	 * The date this domain was created
	 */
	created_at: Timestamp;
}

export type IgniteEndpoints =
	| Endpoint<'GET', '/v1/ignite/deployments', {deployments: Deployment[]}>
	| Endpoint<
			'GET',
			'/v1/ignite/deployments/:deployment_id/containers',
			{containers: Container[]}
	  >
	| Endpoint<
			'POST',
			'/v1/ignite/deployments/:deployment_id/containers',
			{container: Container}
	  >
	| Endpoint<
			'POST',
			'/v1/ignite/deployments/:deployment_id/containers/:container_id',
			never,
			{
				/**
				 * The ID of the deployment
				 */
				deployment_id: Id<'deployment'>;

				/**
				 * The ID of the container
				 */
				container_id: Id<'container'>;
			}
	  >
	| Endpoint<
			'POST',
			'/v1/ignite/deployments',
			{deployment: Deployment},
			DeploymentConfig
	  >
	| Endpoint<'DELETE', '/v1/ignite/deployments/:deployment_id', Empty>
	| Endpoint<'DELETE', '/v1/ignite/containers/:container_id', Empty>
	| Endpoint<
			'GET',
			'/v1/ignite/containers/:container_id/logs',
			{logs: ContainerLog[]}
	  >
	| Endpoint<'GET', '/v1/ignite/deployments/search', {deployment: Deployment}>
	| Endpoint<
			'GET',
			'/v1/ignite/deployments/:deployment_id',
			{deployment: Deployment}
	  >
	| Endpoint<
			'PUT',
			'/v1/ignite/containers/:container_id/state',
			Empty,
			{
				/**
				 * The state to update the container to
				 */
				preferred_state: ContainerState.STOPPED | ContainerState.RUNNING;
			}
	  >
	| Endpoint<
			'POST',
			'/v1/ignite/gateways/:gateway_id/domains',
			Empty,
			{domain: string}
	  >
	| Endpoint<'GET', '/v1/ignite/gateways/:gateway_id', {gateway: Gateway}>
	| Endpoint<
			'GET',
			'/v1/ignite/deployments/:deployment_id/gateways',
			{gateways: Gateway[]}
	  >
	| Endpoint<
			'POST',
			'/v1/ignite/deployments/:deployment_id/gateways',
			{gateway: Gateway},
			{type: GatewayType; target_port: number; protocol: Gateway['protocol']}
	  >;
