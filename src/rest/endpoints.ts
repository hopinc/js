import type {ChannelEndpoints} from './types/channels.ts';
import type {FleetEndpoints} from './types/fleet.ts';
import type {IgniteEndpoints} from './types/ignite.ts';
import type {Method} from './types/index.ts';
import type {PipeEndpoints} from './types/pipe.ts';
import type {ProjectsEndpoints} from './types/projects.ts';
import type {RegistryEndpoints} from './types/registry.ts';
import type {UserEndpoints} from './types/users.ts';

/**
 * A successful response from an API endpoint
 * @public
 */
export type SuccessfulAPIResponse<T> = {
	success: true;
	data: T;
};

/**
 * An error response from an API endpoint
 * @public
 */
export type ErroredAPIResponse = {
	success: false;
	error: {
		code: string;
		message: string;
	};
};

/**
 * The response from an API endpoint
 * @public
 */
export type APIResponse<T> = SuccessfulAPIResponse<T> | ErroredAPIResponse;

/**
 * A successful response from an API endpoint
 * @public
 */
export type Endpoint<
	M extends Method,
	Path extends string,
	Res,
	Body = undefined,
> = {
	method: M;
	path: Path;
	res: Res;
	body: Body;
};

/**
 * A successful response from an API endpoint
 * @public
 */
export type Endpoints =
	| IgniteEndpoints
	| RegistryEndpoints
	| UserEndpoints
	| ProjectsEndpoints
	| PipeEndpoints
	| ChannelEndpoints
	| FleetEndpoints;
