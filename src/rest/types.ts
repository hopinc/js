export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Hop's API uses ISO 8601 date strings
 */
export type Timestamp = string;

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
			created_at: Timestamp;
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
		/**
		 * Container types are used to describe the type of container that is being deployed.
		 */
		export enum ContainerType {
			/**
			 * Ephemeral containers are a "fire and forget" container. They dont restart if they exit.
			 */
			EPHEMERAL = 0,

			/**
			 * Persistent containers will restart if they exit. They can also be started and stopped programmatically.
			 */
			PERSISTENT = 1,
		}

		/**
		 * Container state is relatively self-explanatory. It describes what the container is currently doing.
		 */
		export enum ContainerState {
			/**
			 * The container is pending creation
			 */
			PENDING = 0,

			/**
			 * The container is running
			 */
			RUNNING = 1,

			/**
			 * The container is stopped
			 */
			STOPPED = 2,

			/**
			 * The container's entrypoint failed (e.g. exited with a non-zero exit code)
			 */
			FAILED = 3,

			/**
			 * The container is being deleted
			 */
			TERMINATING = 4,

			/**
			 * The container exited (e.g. with a zero exit code)
			 */
			EXITED = 5,
		}

		export interface Container {
			/**
			 * The ID of the container
			 */
			id: Id<'container'>;
			/**
			 * The time this container was created
			 */
			created_at: Timestamp;

			/**
			 * The type of this container
			 */
			type: ContainerType;

			/**
			 * The ID of the deployment this container is associated with
			 */
			deployment_id: Id<'deployment'>;

			/**
			 * The state this container is in
			 */
			state: ContainerState;
		}

		export interface GET_DEPLOYMENT_CONTAINERS {
			containers: Container[];
		}
	}
}
