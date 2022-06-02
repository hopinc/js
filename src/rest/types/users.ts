import {Endpoint} from '../endpoints';
import {MemberRole, Project} from './projects';
import {Id, Timestamp} from './types';

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
		projects: Project[];
		user: User;
		project_member_role_map: Record<Id<'project'>, MemberRole>;
	}
>;
