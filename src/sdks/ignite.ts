import {API, assertId, Id, validateId} from '../rest';
import {parseSize} from '../util';
import {BaseSDK} from './base-sdk';

const SIX_MB_IN_BYTES = 6 * 1024 * 1024;

/**
 * Ignite class for interacting with Hop's Ignite product
 */
export class Ignite extends BaseSDK {
	/**
	 * Gets all deployments for a team
	 *
	 * @param teamId The team ID to list deployments for. You only need to provide this if you are using bearer or PAT authorization.
	 * @returns A list of deployments for the given team.
	 */
	async getAllDeployments(teamId?: Id<'team'>) {
		if (this.client.authType !== 'sk' && !teamId) {
			throw new Error('Team ID is required for Bearer or PAT authorization');
		}

		if (this.client.authType === 'sk' && teamId) {
			throw new Error('Team ID is not required for secret authorization');
		}

		const {deployments} = await this.client.get(
			'/v1/ignite/deployments',
			teamId ? {team: teamId} : {},
		);

		return deployments;
	}

	async updateContainerState(
		container: Id<'container'>,
		state:
			| API.Ignite.ContainerState.RUNNING
			| API.Ignite.ContainerState.STOPPED,
	) {
		await this.client.patch(
			'/v1/ignite/containers/:container_id/state',
			{preferred_state: state},
			{container_id: container},
		);
	}

	/**
	 * Creates a new deployment.
	 * You should use this overload if you are authorizing with a bearer or pat.
	 *
	 * @param configOrTeam The team ID to create the deployment in.
	 * @param bearerOrPatConfig The deployment config to create.
	 */
	async createDeployment(
		configOrTeam: Id<'team'>,
		bearerOrPatConfig: API.Ignite.DeploymentConfig,
	): Promise<API.Ignite.Deployment>;

	/**
	 * Create a new deployment. You should use this overload if you are authorizing with a secret key and
	 * not with a bearer or pat.
	 *
	 * @param configOrTeam The config for this deployment.
	 */
	async createDeployment(
		configOrTeam: API.Ignite.DeploymentConfig,
	): Promise<API.Ignite.Deployment>;

	async createDeployment(
		configOrTeam: Id<'team'> | API.Ignite.DeploymentConfig,
		bearerOrPatConfig?: API.Ignite.DeploymentConfig,
	) {
		let config: API.Ignite.DeploymentConfig;
		let team: Id<'team'> | null = null;

		if (typeof configOrTeam === 'object') {
			if (this.client.authType === 'sk') {
				config = configOrTeam;
			} else {
				throw new Error(
					'First argument must be the team ID when using bearer authorization to create deployments.',
				);
			}
		} else {
			if (!bearerOrPatConfig) {
				throw new Error(
					'Second argument must be the deployment config when using bearer authorization to create deployments.',
				);
			}

			if (this.client.authType === 'bearer' || this.client.authType === 'pat') {
				team = configOrTeam;
				config = bearerOrPatConfig;
			} else {
				throw new Error(
					'Only argument must be the config when using secret authorization to create deployments.',
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

		const {deployment} = await this.client.post(
			'/v1/ignite/deployments',
			config,
			team ? {team} : {},
		);

		return deployment;
	}

	/**
	 * Get all containers for a deployment
	 *
	 * @param deployment The ID of the deployment to get
	 * @returns A list of all containers for that team
	 */
	async getContainers(deployment: Id<'deployment'>) {
		const {containers} = await this.client.get(
			'/v1/ignite/deployments/:deployment_id/containers',
			{deployment_id: deployment},
		);

		return containers;
	}

	/**
	 * Gets a deployment by name
	 *
	 * @param teamId The team ID. You only need to provide this if you are getting by name.
	 * @param name The deployment name to get
	 */
	async getDeployment(
		teamId: Id<'team'>,
		name: string,
	): Promise<API.Ignite.Deployment>;

	/**
	 * Gets a deployment by id
	 *
	 * @param id The deployment ID
	 */
	async getDeployment(id: Id<'deployment'>): Promise<API.Ignite.Deployment>;

	async getDeployment(
		teamIdOrId: Id<'team'> | Id<'deployment'>,
		name?: string,
	) {
		if (name) {
			assertId(
				teamIdOrId,
				'team',
				'You must provide a team ID to get a deployment by name',
			);

			const {deployment} = await this.client.get(
				'/v1/ignite/deployments/search',
				{name, team: teamIdOrId},
			);

			return deployment;
		}

		assertId(
			teamIdOrId,
			'deployment',
			'You must provide a valid deployment ID.',
		);

		const {deployment} = await this.client.get(
			'/v1/ignite/deployments/:deployment_id',
			{deployment_id: teamIdOrId},
		);

		return deployment;
	}

	/**
	 * Deletes a deployment
	 *
	 * @param deployment The ID of the deployment
	 */
	async deleteDeployment(deployment: Id<'deployment'>) {
		await this.client.delete(
			'/v1/ignite/deployments/:deployment_id',
			undefined,
			{deployment_id: deployment},
		);
	}

	/**
	 * Creates a container
	 *
	 * @param deployment The ID of a deployment to create a container in.
	 * @returns The newly created container.
	 */
	async createContainer(deployment: Id<'deployment'>) {
		const {container} = await this.client.post(
			'/v1/ignite/deployments/:deployment_id/containers',
			undefined,
			{deployment_id: deployment},
		);

		return container;
	}

	/**
	 * Deletes a container
	 *
	 * @param container The ID of the container to delete.
	 */
	async deleteContainer(container: Id<'container'>) {
		await this.client.delete('/v1/ignite/containers/:container_id', undefined, {
			container_id: container,
		});
	}

	/**
	 * Get the logs for a container
	 *
	 * @param container The ID of the container
	 * @returns
	 */
	async getLogs(
		container: Id<'container'>,
		options: Partial<{
			sortBy: string;
			orderedBy: 'desc' | 'asc';
			limit: number;
			offset: number;
		}> = {},
	) {
		const {logs} = await this.client.get(
			'/v1/ignite/containers/:container_id/logs',
			{container_id: container, ...options},
		);

		return logs;
	}
}
