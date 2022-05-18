import {Method, API, Id} from './types';

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
	Body = never,
> = {
	method: M;
	path: Path;
	res: Res;
	body: Body;
};

export type Endpoints =
	| Endpoint<'GET', '/v1/pipe/rooms', API.Pipe.GET_ROOMS>
	| Endpoint<
			'POST',
			'/v1/pipe/rooms',
			API.Pipe.CREATE_ROOM,
			{
				/**
				 * The name of the room
				 */
				name: string;

				/**
				 * Any information attatched to the room
				 */
				metadata: API.Pipe.RoomMetadata;
			}
	  >
	| Endpoint<
			'POST',
			'/v1/pipe/rooms/:room_id/join-token',
			API.Pipe.CREATE_JOIN_TOKEN,
			{
				/**
				 * The user id of the user to join into this room
				 * This should be the user id on YOUR systems
				 */
				user_id: string | number;

				/**
				 * Any information attatched to the room
				 */
				metadata: API.Pipe.RoomMetadata;
			}
	  >
	| Endpoint<'GET', '/v1/teams/:team_id/members/@me', API.Teams.GET_MEMBERS_ME>
	| Endpoint<'GET', '/v1/ignite/deployments', API.Ignite.GET_DEPLOYMENTS>
	| Endpoint<
			'GET',
			'/v1/ignite/deployments/:deployment_id/containers',
			API.Ignite.GET_CONTAINERS
	  >
	| Endpoint<
			'POST',
			'/v1/ignite/deployments/:deployment_id/containers',
			API.Ignite.CREATE_CONTAINER,
			{
				/**
				 * The ID of the deployment
				 */
				deployment_id: Id<'deployment'>;
			}
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
	| Endpoint<'GET', '/v1/registry/teams/@this/images', API.Registry.GET_IMAGES>;

export type EndpointMap = {
	[Path in Endpoints['path']]: Extract<Endpoints, {path: Path}>;
};
