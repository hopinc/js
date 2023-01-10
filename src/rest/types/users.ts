import type {Empty, Id, Timestamp} from '../../util/types.ts';
import type {Endpoint} from '../endpoints.ts';
import type {MemberRole, Project} from './projects.ts';

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
	 * @alpha This value will be partially censored if it
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
