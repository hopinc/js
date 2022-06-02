import {Endpoint} from '../endpoints';
import {MemberRole} from './projects';
import {Id, Timestamp} from './types';

export interface PartialUserProject {
	/**
	 * The ID of the project
	 */
	id: Id<'project'>;

	/**
	 * The name of the project
	 */
	name: string;

	/**
	 * The time this project was created at
	 */
	created_at: Timestamp;

	/**
	 * An icon for this project
	 */
	icon: string | null;

	/**
	 * The registry namespace for this project
	 */
	namespace: string;
}

/**
 * A user objct
 */
export interface User {
	/**
	 * The ID of the user
	 */
	id: Id<'user'>;

	/**
	 * The name of the user. Think of this as a display name
	 */
	name: string;

	/**
	 * A unqiue username for the user
	 */
	username: string;

	/**
	 * The email of the user
	 */
	email: string;
}

export type UserEndpoints = Endpoint<
	'GET',
	'/v1/users/@me',
	{
		projects: PartialUserProject[];
		user: User;
		project_member_role_map: Record<Id<'project'>, MemberRole>;
	}
>;
