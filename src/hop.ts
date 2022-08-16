import {
	APIAuthentication,
	APIClient,
	APIClientOptions,
	APITransport,
	transports,
} from './rest/client';
import {channels, ignite, pipe, projects, registry, users} from './sdks';
import {DEFAULT_BASE_URL, DEFAULT_API_OPTIONS} from './util/constants';

export type PartialAPIOptions = Partial<
	Omit<APIClientOptions, 'authentication'>
> &
	Pick<APIClientOptions, 'authentication'>;

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

	constructor(options: PartialAPIOptions);

	constructor(
		authentication: APIAuthentication,
		baseurl?: string,
		transport?: APITransport,
	);

	constructor(
		authenticationOrOptions: APIAuthentication | PartialAPIOptions,
		baseUrl = DEFAULT_BASE_URL,
		transport = transports.fetch,
	) {
		this.client = new APIClient(
			typeof authenticationOrOptions === 'object'
				? {...DEFAULT_API_OPTIONS, ...authenticationOrOptions}
				: {authentication: authenticationOrOptions, baseUrl, transport},
		);

		this.ignite = ignite(this.client);
		this.users = users(this.client);
		this.projects = projects(this.client);
		this.pipe = pipe(this.client);
		this.registry = registry(this.client);
		this.channels = channels(this.client);
	}
}
