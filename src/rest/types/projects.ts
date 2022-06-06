import {Endpoint} from '../endpoints';
import {Empty, Id, Timestamp} from './types';
import {User} from './users';

export type Member = Omit<User, 'email' | 'id'> & {
	/**
	 * The ID of the project member
	 */
	id: Id<'pm'>;

	/**
	 * The role that this member has in a project
	 */
	role: MemberRole;

	/**
	 * The date that this member joined the project
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
 * A secret key for a project
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

/**
 * Type of a project
 */
export enum ProjectType {
	/**
	 * A regular project is
	 */
	REGULAR,

	/**
	 * A personal project are created when you register an account
	 */
	PERSONAL,
}

export interface Project {
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

	/**
	 * The type of this project. Either regular or personal
	 */
	type: ProjectType;
}

export type ProjectsEndpoints =
	| Endpoint<
			'DELETE',
			'/v1/projects/:project_id/secret-keys/:secret_key_id',
			Empty
	  >
	| Endpoint<'DELETE', '/v1/projects/@this/secret-keys/:secret_key_id', Empty>
	| Endpoint<
			'GET',
			'/v1/projects/:project_id/members/@me',
			{project_member: Member}
	  >
	| Endpoint<
			'GET',
			'/v1/projects/:project_id/secret-keys',
			{secret_keys: SecretKey[]}
	  >
	| Endpoint<
			'GET',
			'/v1/projects/@this/secret-keys',
			{secret_keys: SecretKey[]}
	  >
	| Endpoint<'GET', '/v1/projects/:project_id/members', {members: Member[]}>
	| Endpoint<'GET', '/v1/projects/@this/members', {members: Member[]}>
	| Endpoint<
			'POST',
			'/v1/projects/:project_id/secret-keys',
			{
				secret_key: {
					id: Id<'skid'>;
					key: Id<'sk'>;
					project: Project;
					created_at: Timestamp;
					flags: number;
				};
			},
			{flags: number}
	  >;
