import {APIAuthentication, APIClient} from './rest/client';
import {channels} from './sdks/channels';
import {ignite} from './sdks/ignite';
import {pipe} from './sdks/pipe';
import {projects} from './sdks/projects';
import {registry} from './sdks/registry';
import {users} from './sdks/users';
import {DEFAULT_BASE_URL} from './util/constants';

/**
 * Constructs a new instance of Hop and all of its SDKs.
 *
 * @example
 * ```ts
 * const hop = new Hop(bearerTokenOrPATOrProjectToken);
 * await hop.ignite.containers.create(deploymentId);
 * ```
 */
export class Hop {
	public readonly client: APIClient;

	public readonly ignite;
	public readonly users;
	public readonly projects;
	public readonly pipe;
	public readonly registry;
	public readonly channels;

	constructor(authentication: APIAuthentication, baseUrl = DEFAULT_BASE_URL) {
		const client = (this.client = new APIClient({
			authentication: authentication,
			baseUrl,
		}));

		this.ignite = ignite(client);
		this.users = users(client);
		this.projects = projects(client);
		this.pipe = pipe(client);
		this.registry = registry(client);
		this.channels = channels(client);
	}
}
