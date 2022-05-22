import {APIAuthorization, APIClient} from './rest/client';
import {Ignite, Pipe, Teams} from './sdks';
import {User} from './sdks/user';
import {DEFAULT_BASE_URL} from './util/constants';

export class Hop {
	private readonly sdks;

	public readonly ignite;
	public readonly users;
	public readonly teams;
	public readonly authType;

	constructor(
		private readonly authorzation: APIAuthorization,
		private readonly baseUrl = DEFAULT_BASE_URL,
	) {
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
				containers: this.sdks.ignite.getContainers.bind(this.sdks.ignite),
			},

			containers: {
				create: this.sdks.ignite.createContainer.bind(this.sdks.ignite),
				delete: this.sdks.ignite.deleteContainer.bind(this.sdks.ignite),
				getLogs: this.sdks.ignite.getLogs.bind(this.sdks.ignite),
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
	}
}
