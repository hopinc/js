import {Endpoint} from '../endpoints';
import {Id, Timestamp} from './types';

export type StreamMetadata = unknown;

export interface Stream {
	/**
	 * The ID of this stream
	 */
	id: Id<'stream'>;

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
	| Endpoint<'GET', '/v1/pipe/streams', {streams: Stream[]}>
	| Endpoint<
			'POST',
			'/v1/pipe/streams',
			{room: Stream},
			{
				/**
				 * The name of the stream
				 */
				name: string;

				/**
				 * Any information attatched to the stream
				 */
				metadata: StreamMetadata;
			}
	  >
	| Endpoint<
			'POST',
			'/v1/pipe/streams/:stream_id/join-token',
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
				metadata: StreamMetadata;
			}
	  >;
