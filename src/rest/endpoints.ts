import {ChannelEndpoints} from './types/channels.js';
import {IgniteEndpoints} from './types/ignite.js';
import {Method} from './types/index.js';
import {PipeEndpoints} from './types/pipe.js';
import {ProjectsEndpoints} from './types/projects.js';
import {RegistryEndpoints} from './types/registry.js';
import {UserEndpoints} from './types/users.js';

export type SuccessfulAPIResponse<T> = {
	success: true;
	data: T;
};

export type ErroredAPIResponse = {
	success: false;
	error: {
		code: string;
		message: string;
	};
};

export type APIResponse<T> = SuccessfulAPIResponse<T> | ErroredAPIResponse;

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

export type Endpoints =
	| IgniteEndpoints
	| RegistryEndpoints
	| UserEndpoints
	| ProjectsEndpoints
	| PipeEndpoints
	| ChannelEndpoints;
