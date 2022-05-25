import {API, Id} from './rest';
import {APIAuthorization, APIClient} from './rest/client';
import {Ignite, Pipe, Teams} from './sdks';
import {User} from './sdks/user';
import {DEFAULT_BASE_URL} from './util/constants';

/**
 * Constructs a new instance of Hop and all of its SDKs.
 *
 * @example
 * ```ts
 * const hop = new Hop(bearerTokenOrPATOrSecretKey);
 * await hop.ignite.containers.create(deploymentId);
 * ```
 *
 * If you would like to use only a subclass, you can do so by importing and instantiating that class directly.
 *
 * For example
 * ```ts
 * import {Ignite} from '@onehop/js';
 * const ignite = new Ignite(bearerTokenOrPATOrSecretKey);
 * ```
 */
export class Hop {
	private readonly sdks;

	public readonly ignite;
	public readonly users;
	public readonly teams;
	public readonly pipe;

	public readonly authType;

	constructor(authorzation: APIAuthorization, baseUrl = DEFAULT_BASE_URL) {
		this.authType = APIClient.getAuthType(authorzation);

		this.sdks = {
			ignite: new Ignite(authorzation, baseUrl),
			user: new User(authorzation, baseUrl),
			pipe: new Pipe(authorzation, baseUrl),
			teams: new Teams(authorzation, baseUrl),
		};

		this.ignite = {
			deployments: {
				create: this.sdks.ignite.createDeployment.bind(this.sdks.ignite),
				delete: this.sdks.ignite.deleteDeployment.bind(this.sdks.ignite),
				getAll: this.sdks.ignite.getAllDeployments.bind(this.sdks.ignite),
				get: this.sdks.ignite.getDeployment.bind(this.sdks.ignite),
				getContainers: this.sdks.ignite.getContainers.bind(this.sdks.ignite),
			},

			containers: {
				create: this.sdks.ignite.createContainer.bind(this.sdks.ignite),
				delete: this.sdks.ignite.deleteContainer.bind(this.sdks.ignite),
				getLogs: this.sdks.ignite.getLogs.bind(this.sdks.ignite),

				stop: async (container: Id<'container'>) => {
					await this.sdks.ignite.updateContainerState(
						container,
						API.Ignite.ContainerState.STOPPED,
					);
				},

				start: async (container: Id<'container'>) => {
					await this.sdks.ignite.updateContainerState(
						container,
						API.Ignite.ContainerState.PENDING,
					);
				},
			},
		};

		this.users = {
			me: {
				get: this.sdks.user.getMe.bind(this.sdks.user),
			},
		};

		this.teams = {
			secretKeys: {
				delete: this.sdks.teams.deleteSecretKey.bind(this.sdks.teams),
			},

			getCurrentMember: this.sdks.teams.getCurrentMember.bind(this.sdks.teams),
		};

		this.pipe = {
			streams: {
				getAll: this.sdks.pipe.getStreams.bind(this.sdks.pipe),
			},
		};
	}
}
