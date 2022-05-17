export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const ID_PREFIXES = [
	{
		prefix: 'user',
		description: 'Users',
	},
	{
		prefix: 'team',
		description: 'Teams',
	},
	{
		prefix: 'tm',
		description: 'Team Members',
	},
	{
		prefix: 'role',
		description: 'Roles',
	},
	{
		prefix: 'ti',
		description: 'Team Invite',
	},
	{
		prefix: 'sk',
		description: 'Secret Key',
	},
	{
		prefix: 'pat',
		description: 'Team members personal access token',
	},
	{
		prefix: 'container',
		description: 'Ignite container',
	},
	{
		prefix: 'room',
		description: 'Pipe room',
	},
	{
		prefix: 'deployment',
		description: 'Ignite deployment',
	},
] as const;

export type IdPrefixes = typeof ID_PREFIXES[number]['prefix'];
export type Id<T extends IdPrefixes> = `${T}_${string}`;
export type AnyId = Id<IdPrefixes>;

export function validateId<T extends IdPrefixes>(
	maybeId: string,
	prefix: T,
): maybeId is Id<T> {
	return maybeId.startsWith(prefix);
}

export namespace API {
	export namespace Pipe {
		export type RoomMetadata = unknown;

		export interface Room {
			/**
			 * The ID of this room
			 */
			id: Id<'room'>;

			/**
			 * The name of this room
			 */
			name: string;

			/**
			 * The unix timestamp of when this room was created
			 */
			created_at: number;
		}

		export interface GET_ROOMS {
			rooms: Room[];
		}

		export interface CREATE_ROOM {
			room: Room;
		}

		export interface CREATE_JOIN_TOKEN {
			join_token: string;
		}
	}

	export namespace Teams {
		export interface Member {
			/**
			 * The ID of the user
			 */
			id: Id<'tm'>;
			/**
			 * The personal access token of this user.
			 * Most characters will be hidden if this is NOT the first time you have seen this token.
			 */
			pat: string;
			/**
			 * The role of this user in the team
			 */
			role: MemberRole;
		}

		export interface MemberRole {
			/**
			 * The ID of the role
			 */
			id: Id<'role'>;
			/**
			 * The name of the role
			 */
			name: string;
			/**
			 * The flags for this role
			 */
			flag: number;
		}
	}

	export namespace Ignite {
		export interface Container {
			id: Id<'container'>;
			created_at: string;
			type: number;
			deployment_id: string;
			state: number;
		}

		export interface GET_DEPLOYMENT_CONTAINERS {
			containers: Container[];
		}
	}
}
