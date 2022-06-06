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
 * A project token for a project
 */
export interface ProjectToken {
	/**
	 * The Id of the project token
	 */
	id: Id<'ptkid'>;

	/**
	 * The key value. This will likely have half of the key obfuscated
	 */
	token: Id<'ptk'>;

	/**
	 * The time this project token was created
	 */
	created_at: Timestamp;

	/**
	 * Permissions and flags that this project token can perform
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
			'/v1/projects/:project_id/tokens/:project_token_id',
			Empty
	  >
	| Endpoint<'DELETE', '/v1/projects/@this/tokens/:project_token_id', Empty>
	| Endpoint<
			'GET',
			'/v1/projects/:project_id/members/@me',
			{project_member: Member}
	  >
	| Endpoint<
			'GET',
			'/v1/projects/:project_id/tokens',
			{project_tokens: ProjectToken[]}
	  >
	| Endpoint<
			'GET',
			'/v1/projects/@this/tokens',
			{project_tokens: ProjectToken[]}
	  >
	| Endpoint<'GET', '/v1/projects/:project_id/members', {members: Member[]}>
	| Endpoint<'GET', '/v1/projects/@this/members', {members: Member[]}>
	| Endpoint<
			'POST',
			'/v1/projects/:project_id/tokens',
			{project_token: ProjectToken & {project: Project}},
			{flags: number}
	  >;
