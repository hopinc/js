import {create, Infer} from '@onehop/json-methods';
import {API, assertId, Id} from '../rest/index.js';
import {Deployment, Gateway, GatewayType} from '../rest/types/ignite.js';
import {parseSize} from '../util/index.js';
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

		createGateway(
			type: API.Ignite.GatewayType,
			protocol: API.Ignite.Gateway['protocol'],
			port: number,
		) {
			return igniteSDK.deployments.gateways.create(
				this.id,
				type,
				protocol,
				port,
			);
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
		bearerOrPatConfig: API.Ignite.DeploymentConfig,
	): Promise<Infer<typeof Deployments>>;

	/**
	 * Create a new deployment. You should use this overload if you are authorizing with a project token and
	 * not with a bearer or pat.
	 *
	 * @param configOrProject The config for this deployment.
	 */
	async function createDeployment(
		configOrProject: API.Ignite.DeploymentConfig,
	): Promise<Infer<typeof Deployments>>;

	async function createDeployment(
		configOrProject: Id<'project'> | API.Ignite.DeploymentConfig,
		bearerOrPatConfig?: API.Ignite.DeploymentConfig,
	): Promise<Infer<typeof Deployments>> {
		let config: API.Ignite.DeploymentConfig;
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
		projectId: Id<'project'>,
		name: string,
	): Promise<Infer<typeof Deployments>>;

	/**
	 * Gets a deployment by id
	 *
	 * @param id The deployment ID
	 */
	async function getDeployment(
		id: Id<'deployment'>,
	): Promise<Infer<typeof Deployments>>;

	async function getDeployment(
		projectIdOrId: Id<'project'> | Id<'deployment'>,
		name?: string,
	): Promise<Infer<typeof Deployments>> {
		if (name) {
			assertId(
				projectIdOrId,
				'project',
				'You must provide a project ID to get a deployment by name',
			);

			const {deployment} = await client.get('/v1/ignite/deployments/search', {
				name,
				project: projectIdOrId,
			});

			return Deployments.from(deployment);
		}

		assertId(
			projectIdOrId,
			'deployment',
			'You must provide a valid deployment ID.',
		);

		const {deployment} = await client.get(
			'/v1/ignite/deployments/:deployment_id',
			{deployment_id: projectIdOrId},
		);

		return Deployments.from(deployment);
	}

	const igniteSDK = {
		gateways: {
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

		deployments: {
			create: createDeployment,
			get: getDeployment,

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

			gateways: {
				/**
				 * Fecthes all gateways attached to a deployment
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
				 * @param type The type of the gatway to create, either internal or external
				 * @param protocol The protocol that the gateway will listen for
				 * @param listeningPort The port to listen on
				 */
				async create(
					deployment: Deployment | Deployment['id'],
					type: GatewayType,
					protocol: Gateway['protocol'],
					listeningPort: number,
				) {
					const deploymentId =
						typeof deployment === 'object' ? deployment.id : deployment;

					const {gateway} = await client.post(
						'/v1/ignite/deployments/:deployment_id/gateways',
						{type, protocol, listening_port: listeningPort},
						{deployment_id: deploymentId},
					);

					return Gateways.from(gateway);
				},
			},
		},

		containers: {
			/**
			 * Deletes a container
			 *
			 * @param container The ID of the container to delete.
			 */
			async delete(container: Id<'container'>) {
				await client.delete('/v1/ignite/containers/:container_id', undefined, {
					container_id: container,
				});
			},

			/**
			 * Get the logs for a container
			 *
			 * @param container The ID of the container
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
