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
	 * The unix timestamp of when this room was created
	 */
	created_at: Timestamp;
}

export interface GET_STREAMS {
	streams: Stream[];
}

export interface CREATE_STREAM {
	room: Stream;
}

export interface CREATE_JOIN_TOKEN {
	join_token: string;
}
