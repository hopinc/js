import {Empty, Id, Timestamp} from '../../util/types.js';
import {Endpoint} from '../endpoints.js';
import {MemberRole, Project} from './projects.js';

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

export interface PAT {
	/**
	 * The ID of the pat
	 */
	id: Id<'pat'>;

	/**
	 * The name of the pat
	 */
	name: string | null;

	/**
	 * The pat token
	 *
	 * @warning This value will be partially censored if it
	 */
	pat: string;

	/**
	 * The date the pat was created
	 */
	created_at: Timestamp;
}

export type UserEndpoints =
	| Endpoint<
			'GET',
			'/v1/users/@me',
			{
				projects: Project[];
				user: User;
				project_member_role_map: Record<Id<'project'>, MemberRole>;
				leap_token: string | null;
			}
	  >
	| Endpoint<'POST', '/v1/users/@me/pats', {pat: PAT}, {name: string}>
	| Endpoint<'GET', '/v1/users/@me/pats', {pats: PAT[]}>
	| Endpoint<'DELETE', '/v1/users/@me/pats/:pat_id', Empty>;
