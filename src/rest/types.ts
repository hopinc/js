export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export namespace Responses {
	export namespace PIPE {
		export interface Room {
			id: string;
			name: string;
			created_at: number;
		}

		export interface GET_ROOMS {
			rooms: Room[];
		}

		export interface CREATE_ROOM {
			room: Room;
		}
	}
}
