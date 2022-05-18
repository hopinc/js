import {API, Endpoints, Id} from '../rest';
import {APIAuthorization, APIClient} from '../rest/client';
import {parseSize} from '../util';
import {DEFAULT_BASE_URL} from '../util/constants';

const SIX_MB_IN_BYTES = 6 * 1024 * 1024;

export class Ignite {
	private readonly authorization: APIAuthorization;
	private readonly client: APIClient;

	constructor(authorization: APIAuthorization, baseUrl = DEFAULT_BASE_URL) {
		this.authorization = authorization;
		this.client = new APIClient({baseUrl, authorization});
	}

	async getDeployments(teamId?: Id<'team'>) {
		if (this.authorization.type === 'console' && !teamId) {
			throw new Error('Team ID is required for console authorization');
		}

		if (teamId && this.authorization.type === 'sk') {
			throw new Error('Team ID is not required for sk authorization');
		}

		const query = teamId ? {team: teamId} : undefined;

		const {deployments} = await this.client.get(
			'/v1/ignite/deployments',
			query,
		);

		return deployments;
	}

	async createDeployment(
		configOrTeam: Id<'team'> | API.Ignite.DeploymentConfig,
		consoleConfig?: API.Ignite.DeploymentConfig,
	) {
		let config: API.Ignite.DeploymentConfig;
		let team: Id<'team'> | null = null;

		if (typeof configOrTeam === 'object') {
			if (this.authorization.type === 'sk') {
				config = configOrTeam;
			} else {
				throw new Error(
					'First argument must be the team ID when using console authorization to create deployments.',
				);
			}
		} else {
			if (!consoleConfig) {
				throw new Error(
					'Second argument must be the deployment config when using console authorization to create deployments.',
				);
			}

			if (this.authorization.type === 'console') {
				team = configOrTeam;
				config = consoleConfig;
			} else {
				throw new Error(
					'Only argument must be the config when using sk authorization to create deployments.',
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
			team ? {team} : undefined,
		);

		return deployment;
	}
}
