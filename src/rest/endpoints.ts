import {API, Id, Method} from './types';

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
	| Endpoint<'GET', '/v1/ignite/deployments', API.Ignite.GET_DEPLOYMENTS>
	| Endpoint<
			'GET',
			'/v1/ignite/deployments/:deployment_id/containers',
			API.Ignite.GET_CONTAINERS
	  >
	| Endpoint<
			'POST',
			'/v1/ignite/deployments/:deployment_id/containers',
			API.Ignite.CREATE_CONTAINER
	  >
	| Endpoint<
			'POST',
			'/v1/ignite/deployments/:deployment_id/containers/:container_id',
			never,
			{
				/**
				 * The ID of the deployment
				 */
				deployment_id: Id<'deployment'>;

				/**
				 * The ID of the container
				 */
				container_id: Id<'container'>;
			}
	  >
	| Endpoint<
			'POST',
			'/v1/ignite/deployments',
			API.Ignite.CREATE_DEPLOYMENT,
			API.Ignite.DeploymentConfig
	  >
	| Endpoint<
			'DELETE',
			'/v1/ignite/deployments/:deployment_id',
			API.Ignite.DELETE_DEPLOYMENT
	  >
	| Endpoint<
			'DELETE',
			'/v1/ignite/containers/:container_id',
			API.Ignite.DELETE_CONTAINER
	  >
	| Endpoint<
			'GET',
			'/v1/ignite/containers/:container_id/logs',
			API.Ignite.GET_LOGS
	  >
	| Endpoint<
			'GET',
			'/v1/ignite/deployments/search',
			API.Ignite.SEARCH_DEPLOYMENTS
	  >
	| Endpoint<
			'GET',
			'/v1/ignite/deployments/:deployment_id',
			API.Ignite.GET_DEPLOYMENT
	  >
	| Endpoint<'GET', '/v1/registry/teams/@this/images', API.Registry.GET_IMAGES>
	| Endpoint<'GET', '/v1/users/@me', API.Users.GET_ME>
	| Endpoint<
			'DELETE',
			'/v1/teams/secret-keys/:secret_key',
			API.Teams.DELETE_SECRET_KEY
	  >
	| Endpoint<'GET', '/v1/teams/:team_id/members/@me', API.Teams.GET_MEMBERS_ME>
	| Endpoint<'GET', '/v1/teams/:team_id/secret-keys', API.Teams.GET_SECRET_KEYS>
	| Endpoint<'GET', '/v1/teams/@this/secret-keys', API.Teams.GET_SECRET_KEYS>
	| Endpoint<
			'PATCH',
			'/v1/ignite/containers/:container_id/state',
			API.Ignite.UPDATE_CONTAINER_STATE,
			{
				/**
				 * The state to update the container to
				
				 */
				preferred_state:
					| API.Ignite.ContainerState.STOPPED
					| API.Ignite.ContainerState.RUNNING;
			}
	  >
	| Endpoint<'GET', '/v1/pipe/streams', API.Pipe.GET_STREAMS>
	| Endpoint<
			'POST',
			'/v1/pipe/streams',
			API.Pipe.CREATE_STREAM,
			{
				/**
				 * The name of the stream
				 */
				name: string;

				/**
				 * Any information attatched to the stream
				 */
				metadata: API.Pipe.StreamMetadata;
			}
	  >
	| Endpoint<
			'POST',
			'/v1/pipe/streams/:stream_id/join-token',
			API.Pipe.CREATE_JOIN_TOKEN,
			{
				/**
				 * The user id of the user to join into this strema
				 * This should be the user id on YOUR systems
				 */
				user_id: string | number;

				/**
				 * Any information attatched to the strema
				 */
				metadata: API.Pipe.StreamMetadata;
			}
	  >;
