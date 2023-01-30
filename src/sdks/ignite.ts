import {create, Infer} from '@onehop/json-methods';
import {API, assertId, Id} from '../rest/index.js';
import {
	Deployment,
	DeploymentConfig,
	Gateway,
	GatewayType,
	RuntimeType,
} from '../rest/types/ignite.js';
import {parseSize, validateId} from '../util/index.js';
import {sdk} from './create.js';

const SIX_MB_IN_BYTES = 6 * 1024 * 1024;

export const ignite = sdk(client => {
	const Gateways = create<API.Ignite.Gateway>().methods({
		async addDomain(domain: string) {
			await client.post(
				'/v1/ignite/gateways/:gateway_id/domains',
				{domain},
				{gateway_id: this.id},
			);
		},

		async deleteDomain(domainId: Id<'domain'>) {
			await client.delete('/v1/ignite/domains/:domain_id', undefined, {
				domain_id: domainId,
			});
		},
	});

	const Deployments = create<API.Ignite.Deployment>().methods({
		getContainers() {
			return igniteSDK.deployments.getContainers(this.id);
		},

		delete() {
			return igniteSDK.deployments.delete(this.id);
		},

		createContainer() {
			return igniteSDK.containers.create(this.id);
		},

		createGateway(config: {
			type: API.Ignite.GatewayType.EXTERNAL;
			protocol: API.Ignite.Gateway['protocol'];
			name: string;
			targetPort: number;
		} | {
			type: API.Ignite.GatewayType.INTERNAL;
			protocol: API.Ignite.Gateway['protocol'];
			name: string;
			targetPort: number;
			internalDomain: string;
		}) {
			return igniteSDK.gateways.create(this.id, config);
		},

		getStorageStats() {
			return igniteSDK.deployments.getStorageStats(this.id);
		},
	});

	/**
	 * Creates a new deployment.
	 * You should use this overload if you are authorizing with a bearer or pat.
	 *
	 * @param configOrProject The project ID to create the deployment in.
	 * @param bearerOrPatConfig The deployment config to create.
	 */
	async function createDeployment(
		configOrProject: Id<'project'>,
		bearerOrPatConfig: API.Ignite.CreateDeploymentConfig,
	): Promise<Infer<typeof Deployments>>;

	/**
	 * Create a new deployment. You should use this overload if you are authorizing with a project token and
	 * not with a bearer or pat.
	 *
	 * @param configOrProject The config for this deployment.
	 */
	async function createDeployment(
		configOrProject: API.Ignite.CreateDeploymentConfig,
	): Promise<Infer<typeof Deployments>>;

	async function createDeployment(
		configOrProject: Id<'project'> | API.Ignite.CreateDeploymentConfig,
		bearerOrPatConfig?: API.Ignite.CreateDeploymentConfig,
	): Promise<Infer<typeof Deployments>> {
		let config: API.Ignite.CreateDeploymentConfig;
		let project: Id<'project'> | undefined = undefined;

		if (typeof configOrProject === 'object') {
			if (client.authType === 'ptk') {
				config = configOrProject;
			} else {
				throw new Error(
					'First argument must be the project ID when using bearer authentication to create deployments.',
				);
			}
		} else {
			if (!bearerOrPatConfig) {
				throw new Error(
					'Second argument must be the deployment config when using bearer authentication to create deployments.',
				);
			}

			if (client.authType === 'bearer' || client.authType === 'pat') {
				project = configOrProject;
				config = bearerOrPatConfig;
			} else {
				throw new Error(
					'Only argument must be the config when using secret authentication to create deployments.',
				);
			}
		}

		// Hop's runtime requires a minimum of 6mb of memory per container
		// It's useful to validate this at the SDK level as well as API level.
		if (parseSize(config.resources.ram) <= SIX_MB_IN_BYTES) {
			throw new Error(
				'Allocated memory must be greater than 6MB when creating a deployment.',
			);
		}

		if (config.volume && config.type !== RuntimeType.STATEFUL) {
			throw new Error(
				'Cannot create a deployment with a volume that is not stateful.',
			);
		}

		const {deployment} = await client.post('/v1/ignite/deployments', config, {
			project,
		});

		return Deployments.from(deployment);
	}

	async function updateContainerState(
		container: Id<'container'>,
		state:
			| API.Ignite.ContainerState.RUNNING
			| API.Ignite.ContainerState.STOPPED,
	) {
		await client.put(
			'/v1/ignite/containers/:container_id/state',
			{preferred_state: state},
			{container_id: container},
		);
	}

	/**
	 * Gets a deployment by name
	 *
	 * @param projectId The project ID. You only need to provide this if you are getting by name.
	 * @param name The deployment name to get
	 */
	async function getDeployment(
		name: string,
		projectId?: Id<'project'>,
	): Promise<Infer<typeof Deployments>>;

	/**
	 * Gets a deployment by id
	 *
	 * @param id The deployment ID
	 * @param projectId The project ID
	 */
	async function getDeployment(
		id: Id<'deployment'>,
		projectId?: Id<'project'>,
	): Promise<Infer<typeof Deployments>>;

	async function getDeployment(
		idOrName: Id<'deployment'> | string,
		projectId?: Id<'project'>,
	): Promise<Infer<typeof Deployments>> {
		if (!validateId(idOrName, 'deployment')) {
			const {deployment} = await client.get('/v1/ignite/deployments/search', {
				name: idOrName,
				project: projectId,
			});

			return Deployments.from(deployment);
		}

		assertId(idOrName, 'deployment', 'You must provide a valid deployment ID.');

		const {deployment} = await client.get(
			'/v1/ignite/deployments/:deployment_id',
			{
				deployment_id: idOrName,
				project: projectId,
			},
		);

		return Deployments.from(deployment);
	}

	const deploymentGateways = {
		/**
		 * Fetches all gateways attached to a deployment
		 *
		 * @param deploymentId The ID of the deployment to fetch gateways for
		 */
		async getAll(deploymentId: Id<'deployment'>) {
			const {gateways} = await client.get(
				'/v1/ignite/deployments/:deployment_id/gateways',
				{deployment_id: deploymentId},
			);

			return gateways.map(Gateways.from);
		},

		/**
		 * Creates and attaches a gateway to a deployment
		 *
		 * @param deployment The deployment to create a gateway on
		 * @param config The gateway config
		 * @param config.type The type of the gateway to create, either internal or external
		 * @param config.protocol The protocol that the gateway will listen for
		 * @param config.targetPort The port to listen on
		 * @param config.name The name of the gateway
		 * @param config.internalDomain The internal domain to use for the gateway
		 */
		async create(
			deployment: Deployment | Deployment['id'],
			config: {
				type: GatewayType.EXTERNAL;
				protocol: Gateway['protocol'];
				targetPort: number;
				name: string;
			} | {
				type: GatewayType.INTERNAL;
				protocol: Gateway['protocol'];
				targetPort: number;
				name: string;
				internalDomain: string;
			},
		) {
			const deploymentId =
				typeof deployment === 'object' ? deployment.id : deployment;

			const body = config.type === GatewayType.EXTERNAL ? (
				{...config, target_port: config.targetPort}
			) : (
				{...config, target_port: config.targetPort, internal_domain: config.internalDomain}
			);

			const {gateway} = await client.post(
				'/v1/ignite/deployments/:deployment_id/gateways',
				body,
				{deployment_id: deploymentId},
			);

			return Gateways.from(gateway);
		},
	};

	const igniteSDK = {
		domains: {
			delete: async (id: Id<'domain'>) => {
				await client.delete('/v1/ignite/domains/:domain_id', undefined, {
					domain_id: id,
				});
			},

			get: async (id: Id<'domain'>) => {
				const {domain} = await client.get('/v1/ignite/domains/:domain_id', {
					domain_id: id,
				});

				return domain;
			},
		},

		gateways: {
			...deploymentGateways,

			/**
			 * Adds a domain to a gateway
			 *
			 * @param gatewayId The ID of the gateway
			 * @param domain The full name of the domain
			 */
			async addDomain(gatewayId: Id<'gateway'>, domain: string) {
				await client.post(
					'/v1/ignite/gateways/:gateway_id/domains',
					{domain},
					{gateway_id: gatewayId},
				);
			},

			/**
			 * Fetches a gateway by ID
			 *
			 * @param gatewayId The ID of the gateway to retrieve
			 */
			async get(gatewayId: Id<'gateway'>) {
				const {gateway} = await client.get('/v1/ignite/gateways/:gateway_id', {
					gateway_id: gatewayId,
				});

				return gateway;
			},
		},

		healthChecks: {
			create: async (
				deployment: Id<'deployment'>,
				config: Omit<API.Ignite.HealthCheck, 'id'>,
			) => {
				const {health_check: check} = await client.post(
					'/v1/ignite/deployments/:deployment_id/health-check',
					config,
					{deployment_id: deployment},
				);

				return check;
			},

			update: async (
				deployment: Id<'deployment'>,
				config: Partial<Omit<API.Ignite.HealthCheck, 'id'>>,
			) => {
				await client.patch(
					'/v1/ignite/deployments/:deployment_id/health-check',
					config,
					{deployment_id: deployment},
				);
			},
		},

		deployments: {
			create: createDeployment,
			get: getDeployment,

			async rollout(id: Id<'deployment'>) {
				const {rollout} = await client.post(
					'/v1/ignite/deployments/:deployment_id/rollouts',
					undefined,
					{deployment_id: id},
				);

				return rollout;
			},

			async getStorageStats(id: Id<'deployment'>) {
				return client.get('/v1/ignite/deployments/:deployment_id/storage', {
					deployment_id: id,
				});
			},

			async update(deploymentId: Id<'deployment'>, config: DeploymentConfig) {
				const {deployment} = await client.patch(
					'/v1/ignite/deployments/:deployment_id',
					config,
					{deployment_id: deploymentId},
				);

				return deployment;
			},

			/**
			 * Get all containers for a deployment
			 *
			 * @param deployment The ID of the deployment to get
			 * @returns A list of all containers for that project
			 */
			async getContainers(deployment: Id<'deployment'>) {
				const {containers} = await client.get(
					'/v1/ignite/deployments/:deployment_id/containers',
					{deployment_id: deployment},
				);

				return containers;
			},

			/**
			 * Gets all deployments for a project
			 *
			 * @param projectId The project ID to list deployments for. You only need to provide this if you are using bearer or PAT authentication.
			 * @returns A list of deployments for the given project.
			 */
			async getAll(projectId?: Id<'project'>) {
				if (client.authType !== 'ptk' && !projectId) {
					throw new Error(
						'Project ID is required for Bearer or PAT authentication',
					);
				}

				if (client.authType === 'ptk' && projectId) {
					throw new Error(
						'Project ID is not required for secret authentication',
					);
				}

				const {deployments} = await client.get(
					'/v1/ignite/deployments',
					projectId ? {project: projectId} : {},
				);

				return deployments.map(Deployments.from);
			},

			/**
			 * Deletes a deployment
			 *
			 * @param deployment The ID of the deployment
			 */
			async delete(deployment: Id<'deployment'>) {
				await client.delete(
					'/v1/ignite/deployments/:deployment_id',
					undefined,
					{deployment_id: deployment},
				);
			},

			/**
			 * @deprecated This property has moved — use hop.ignite.gateways instead
			 */
			gateways: deploymentGateways,
		},

		containers: {
			/**
			 * Deletes a container
			 *
			 * @param container_id container The ID of the container to delete.
			 * @param options Options for deleting the container
			 * @param options.recreate Whether to recreate the container after deleting it
			 */
			async delete(
				container_id: Id<'container'>,
				options: Partial<{
					recreate: boolean;
				}> = {},
			) {
				const d = await client.delete(
					'/v1/ignite/containers/:container_id',
					undefined,
					{
						container_id,
						recreate: options.recreate ? 'true' : undefined,
					},
				);

				if (!d) return;

				return d;
			},

			/**
			 * Get the logs for a container
			 *
			 * @param container The ID of the container
			 * @param options The options to use for the logs
			 * @param options.sortBy The field to sort by
			 * @param options.orderBy The order to sort by
			 * @param options.limit The number of logs to return
			 * @param options.offset The offset to start at
			 * @returns
			 */
			async getLogs(
				container: Id<'container'>,
				options: Partial<{
					sortBy: 'timestamp';
					orderBy: 'desc' | 'asc';
					limit: number;
					offset: number;
				}> = {},
			) {
				const {logs} = await client.get(
					'/v1/ignite/containers/:container_id/logs',
					{container_id: container, ...options},
				);

				return logs;
			},

			async stop(container: Id<'container'>) {
				await updateContainerState(
					container,
					API.Ignite.ContainerState.STOPPED,
				);
			},

			async start(container: Id<'container'>) {
				await updateContainerState(
					container,
					API.Ignite.ContainerState.RUNNING,
				);
			},

			/**
			 * Creates a container
			 *
			 * @param deployment The ID of a deployment to create a container in.
			 * @returns The newly created container.
			 */
			async create(deployment: Id<'deployment'>) {
				const {container} = await client.post(
					'/v1/ignite/deployments/:deployment_id/containers',
					undefined,
					{deployment_id: deployment},
				);

				return container;
			},
		},
	};

	return igniteSDK;
});
