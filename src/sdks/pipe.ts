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

				// These values are constant for now
				// so we can just include them here
				ingest_protocol: 'rtmp',
				region: Regions.US_EAST_1,

				ephemeral: options.ephemeral ?? false,

				delivery_protocols: options.deliveryProtocols,
				llhls_config: options.hlsConfig,
			},
			{},
		);

		return room;
	}
}
