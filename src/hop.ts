import {APIAuthorization} from './rest/client';
import {Ignite} from './sdks';

export class Hop {
	public readonly ignite;

	private readonly sdks;

	constructor(
		private readonly authorzation: APIAuthorization,
		private readonly baseUrl?: string,
	) {
		this.sdks = {
			ignite: new Ignite(authorzation, baseUrl),
		};

		this.ignite = {
			deployments: {
				create: this.sdks.ignite.createDeployment.bind(this.sdks.ignite),
				delete: this.sdks.ignite.deleteDeployment.bind(this.sdks.ignite),
				getAll: this.sdks.ignite.getAllDeployments.bind(this.sdks.ignite),
				get: this.sdks.ignite.get.bind(this.sdks.ignite),
			},

			containers: {
				create: this.sdks.ignite.createContainer.bind(this.sdks.ignite),
				getLogs: this.sdks.ignite.getLogs.bind(this.sdks.ignite),
			},
		};
	}
}
