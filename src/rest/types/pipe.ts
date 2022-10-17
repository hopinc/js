import {Endpoint} from '../endpoints.js';
import {Regions} from './ignite.js';
import {Empty, Id, Timestamp} from '../../util/types.js';

export type DeliveryProtocol = 'webrtc' | 'hls';

export interface Room {
	/**
	 * The ID of this stream
	 */
	id: Id<'pipe_room'>;

	/**
	 * The name of this room
	 */
	name: string;

	/**
	 * The unix timestamp of when this stream was created
	 */
	created_at: Timestamp;

	/**
	 * Protocol you can stream with
	 */
	ingest_protocol: 'rtmp';

	/**
	 * Protocols that are supported by this room to the client
	 */
	delivery_protocols: DeliveryProtocol[];

	/**
	 * A join token to subscribe into this room
	 */
	join_token: string;

	/**
	 * The region that the stream url is located in
	 */
	ingest_region: Regions;

	/**
	 * The URL that you can stream to
	 */
	ingest_endpoint: string;

	/**
	 * The state of the stream currently
	 */
	state: 'live' | 'offline';
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

				ingest_protocol: 'rtmp' | 'rtp';

				delivery_protocols: DeliveryProtocol[];

				region: Regions;

				ephemeral: boolean;

				llhls_config?: {
					wcl_delay: number;
					artificial_delay: number;
					max_playout_bitrate_preset: string;
				};
			}
	  >
	| Endpoint<'DELETE', '/v1/pipe/rooms/:room_id', Empty>;
