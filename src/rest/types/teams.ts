import {Endpoint} from '../endpoints';
import {Empty, Id, Timestamp} from './types';

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

/**
 * A secret key for a team
 */
export interface SecretKey {
	/**
	 * The Id of the secret key
	 */
	id: Id<'skid'>;

	/**
	 * The key value. This will likely have half of the key obfuscated
	 */
	key: Id<'sk'>;

	/**
	 * The time this secret key was created
	 */
	created_at: Timestamp;

	/**
	 * Permissions and flags that this secret key can perform
	 */
	flags: number;
}

export type TeamsEndpoints =
	| Endpoint<'DELETE', '/v1/teams/secret-keys/:secret_key', Empty>
	| Endpoint<'GET', '/v1/teams/:team_id/members/@me', {team_member: Member}>
	| Endpoint<
			'GET',
			'/v1/teams/:team_id/secret-keys',
			{secret_keys: SecretKey[]}
	  >
	| Endpoint<'GET', '/v1/teams/@this/secret-keys', {secret_keys: SecretKey[]}>;
