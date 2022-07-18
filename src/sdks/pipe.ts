import {Id} from '../rest';
import {Regions} from '../rest/types/ignite';
import {DeliveryProtocol} from '../rest/types/pipe';
import {BaseSDK} from './base-sdk';

export class Pipe extends BaseSDK {
	async getRooms(project?: Id<'project'>) {
		if (!project && this.client.authType !== 'ptk') {
			throw new Error(
				'You must provide ID project id when using a bearer or pat token.',
			);
		}

		const {rooms} = await this.client.get('/v1/pipe/rooms', {project});

		return rooms;
	}

	async createRoom(
		name: string,
		options: {
			deliveryProtocols: DeliveryProtocol[];
			ephemeral?: boolean;
			ingestProtocol: 'rtmp' | 'rtp';
			hlsConfig?: {
				wcl_delay: number;
				artificial_delay: number;
				max_playout_bitrate_preset: string;
			};
		},
	) {
		const {room} = await this.client.post(
			'/v1/pipe/rooms',
			{
				name,

				ingest_protocol: options.ingestProtocol,
				region: Regions.US_EAST_1,

				ephemeral: options.ephemeral ?? false,

				delivery_protocols: options.deliveryProtocols,
				llhls_config: options.hlsConfig,
			},
			{},
		);

		return room;
	}

		/**
	 * Deletes a Pipe room
	 *
	 * @param room The ID of the Pipe room to delete.
	 */
		 async deleteRoom(room: Id<'pipe_room'>) {
			await this.client.delete('/v1/pipe/rooms/:room_id', undefined, {
				room_id: room,
			});
		}
}
