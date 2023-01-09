import {APIAuthentication, APIClient, APIClientOptions} from './rest/client.ts';
import {
	channels,
	ignite,
	pipe,
	projects,
	registry,
	users,
} from './sdks/index.ts';
import {DEFAULT_BASE_URL} from './util/constants.ts';

/**
 * Partial options for the Hop client
 * @public
 */
export type PartialAPIOptions = Partial<
	Omit<APIClientOptions, 'authentication'>
> &
	Pick<APIClientOptions, 'authentication'>;

/**
 * Root class containing all methods and types for interacting with the Hop platform.
 * This will be the entrypoint for most users of the Hop SDK.
 *
 * @public
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
	constructor(authentication: APIAuthentication, baseurl?: string);

	constructor(
		authenticationOrOptions: APIAuthentication | PartialAPIOptions,
		baseUrl = DEFAULT_BASE_URL,
	) {
		if (
			!authenticationOrOptions ||
			(typeof authenticationOrOptions === 'object' &&
				!authenticationOrOptions.authentication)
		) {
			throw new Error(
				'Missing authentication token to `new Hop()` — please provide a valid Project Token, User Bearer or Personal Access Token',
			);
		}

		this.client = new APIClient(
			typeof authenticationOrOptions === 'object'
				? {baseUrl: DEFAULT_BASE_URL, ...authenticationOrOptions}
				: {authentication: authenticationOrOptions, baseUrl},
		);

		this.ignite = ignite(this.client);
		this.users = users(this.client);
		this.projects = projects(this.client);
		this.pipe = pipe(this.client);
		this.registry = registry(this.client);
		this.channels = channels(this.client);
	}
}
