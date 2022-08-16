import {create} from '@onehop/json-methods';
import {API, Id} from '../rest';
import {Regions} from '../rest/types/ignite';
import {DeliveryProtocol} from '../rest/types/pipe';
import {sdk} from './create';

export const pipe = sdk(client => {
	const Rooms = create<API.Pipe.Room>().methods({
		async delete() {
			await pipeSDK.rooms.delete(this.id);
		},
	});

	const pipeSDK = {
		rooms: {
			async getAll(project?: Id<'project'>) {
				if (!project && client.authType !== 'ptk') {
					throw new Error(
						'You must provide ID project id when using a bearer or pat token.',
					);
				}

				const {rooms} = await client.get('/v1/pipe/rooms', {project});

				return rooms.map(Rooms.from);
			},

			async create(
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
				const {room} = await client.post(
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

				return Rooms.from(room);
			},

			/**
			 * Deletes a Pipe room
			 *
			 * @param room The ID of the Pipe room to delete.
			 */
			async delete(room: Id<'pipe_room'>) {
				await client.delete('/v1/pipe/rooms/:room_id', undefined, {
					room_id: room,
				});
			},
		},
	};

	return pipeSDK;
});
