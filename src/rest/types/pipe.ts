import {Endpoint} from '../endpoints';
import {Id, Timestamp} from './types';

export type RoomMetadata = unknown;

export interface Room {
	/**
	 * The ID of this stream
	 */
	id: Id<'room'>;

	/**
	 * The name of this room
	 */
	name: string;

	/**
	 * The unix timestamp of when this stream was created
	 */
	created_at: Timestamp;
}

export type PipeEndpoints =
	| Endpoint<'GET', '/v1/pipe/rooms', {rooms: Room[]}>
	| Endpoint<
			'POST',
			'/v1/pipe/rooms',
			{room: Room},
			{
				/**
				 * The name of the stream
				 */
				name: string;

				/**
				 * Any information attatched to the stream
				 */
				metadata: RoomMetadata;
			}
	  >
	| Endpoint<
			'POST',
			'/v1/pipe/rooms/:room_id/join-token',
			{join_token: string},
			{
				/**
				 * The user id of the user to join into this strema
				 * This should be the user id on YOUR systems
				 */
				user_id: string | number;

				/**
				 * Any information attatched to the strema
				 */
				metadata: RoomMetadata;
			}
	  >;
