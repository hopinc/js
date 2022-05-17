import {Method, API} from './types';

export type SuccessfulAPIResposne<T> = {
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

export type APIResponse<T> = SuccessfulAPIResposne<T> | ErroredAPIResponse;

export type Endpoint<
	M extends Method,
	Path extends string,
	Res,
	Body = never,
> = {
	method: M;
	path: Path;
	res: APIResponse<Res>;
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
	| Endpoint<'GET', '/v1/teams/:team_id/members/@me', API.Teams.Member>
	| Endpoint<
			'GET',
			'/v1/ignite/deployments/:deployment_id/containers',
			API.Ignite.Container
	  >;

export type EndpointMap = {
	[Path in Endpoints['path']]: Extract<Endpoints, {path: Path}>;
};
