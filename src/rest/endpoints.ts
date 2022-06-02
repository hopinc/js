import {Method} from './types';

import {IgniteEndpoints} from './types/ignite';
import {PipeEndpoints} from './types/pipe';
import {RegistryEndpoints} from './types/registry';
import {ProjectsEndpoints} from './types/projects';
import {UserEndpoints} from './types/users';

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
	| PipeEndpoints;
