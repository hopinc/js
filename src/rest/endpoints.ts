import {Method} from './types';

import {IgniteEndpoints} from './types/ignite';
import {PipeEndpoints} from './types/pipe';
import {RegistryEndpoints} from './types/registry';
import {TeamsEndpoints} from './types/teams';
import {UserEndpoints} from './types/users';

export type SuccessfulAPIResponse<T> = {
	success: true;
	data: T;
};

export type HopAPIErroredAPIResponse = {
	success: false;
	error: {
		code: string;
		message: string;
	};
};

export type HopAPIDefaultServerAPIErroredResponse = {
	statusCode: number;
	error: string;
	message: string;
};

export type ErroredAPIResponse =
	| HopAPIErroredAPIResponse
	| HopAPIDefaultServerAPIErroredResponse;

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
	| TeamsEndpoints
	| PipeEndpoints;
