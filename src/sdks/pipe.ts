import {Id} from '../rest';
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

	async createJoinToken(
		room: Id<'room'>,
		userId: string | number,
		metadata: unknown,
		project?: Id<'project'>,
	) {
		const {join_token: token} = await this.client.post(
			'/v1/pipe/rooms/:room_id/join-token',
			{metadata, user_id: userId},
			{project, room_id: room},
		);

		return token;
	}
}
