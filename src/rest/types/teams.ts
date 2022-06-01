import {Endpoint} from '../endpoints';
import {Empty, Id, Timestamp} from './types';
import {User} from './users';

export type Member = Omit<User, 'email' | 'id'> & {
	/**
	 * The ID of the team member
	 */
	id: Id<'tm'>;

	/**
	 * The role that this member has in a team
	 */
	role: MemberRole;

	/**
	 * The date that this member joined the team
	 */
	joined_at: Timestamp;
};

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
	flags: number;
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
	| Endpoint<'GET', '/v1/teams/@this/secret-keys', {secret_keys: SecretKey[]}>
	| Endpoint<'GET', '/v1/teams/:team_id/members', {members: Member[]}>
	| Endpoint<'GET', '/v1/teams/@this/members', {members: Member[]}>;
