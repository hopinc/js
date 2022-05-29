import {Endpoint} from '../endpoints';
import {Id, Timestamp} from './types';

export interface PartialUserTeam {
	/**
	 * The ID of the team
	 */
	id: Id<'team'>;

	/**
	 * The name of the team
	 */
	name: string;

	/**
	 * The time this team was created at
	 */
	created_at: Timestamp;

	/**
	 * An icon for this team
	 */
	icon: string | null;

	/**
	 * The registry namespace for this team
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
	{teams: PartialUserTeam[]; user: User}
>;
