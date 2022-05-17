import {Method, Responses} from './types';

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
	| Endpoint<'GET', '/v1/pipe/rooms', Responses.PIPE.GET_ROOMS>
	| Endpoint<
			'POST',
			'/v1/pipe/rooms',
			Responses.PIPE.CREATE_ROOM,
			{
				/**
				 * The name of the room
				 */
				name: string;

				/**
				 * Any information attatched to the room
				 */
				metadata: unknown;
			}
	  >;

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
