import type {Empty, Id, Timestamp} from '../../util/types.ts';
import type {Endpoint} from '../endpoints.ts';
import type {User} from './users.ts';

/**
 * A member is a partial user with information about their membership in a project
 * @public
 */
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
	 * If user has multi-factor authentication enabled.
	 */
	mfa_enabled: boolean;

	/**
	 * The date that this member joined the project
	 */
	joined_at: Timestamp;
};

/**
 * A project tier
 * @public
 */
export enum ProjectTier {
	FREE = 'free',
	PAID = 'paid',
}

/**
 * A role that a member can have in a project
 * @public
 */
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
 * @public
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
 * @public
 */
export enum ProjectType {
	/**
	 * A standard project type
	 */
	REGULAR = 'regular',

	/**
	 * A personal project are created when you register an account
	 */
	PERSONAL = 'personal',
}

/**
 * A project on Hop
 * @public
 */
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
	 * The tier this project is
	 */
	tier: ProjectTier;

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

	default_quotas: DefaultQuotas;

	quota_overrides: QuotaOverrides;

	quota_usage: QuotaUsage;
}

/**
 * Default quotas for a project
 * @public
 */
export interface DefaultQuotas {
	vcpu: number;
	ram: number;
	volume: number;
}

/**
 * Quota overrides for a project
 * @public
 */
export interface QuotaOverrides {}

/**
 * Current usage of a quota for a project
 * @public
 */
export interface QuotaUsage {
	vcpu: number;
	ram: number;
	volume: number;
}

/**
 * A secret is a key/value pair that can be used to store sensitive information
 * @public
 */
export interface Secret {
	/**
	 * The ID of the secret
	 */
	id: Id<'secret'>;

	/**
	 * The name of the secret
	 */
	name: string;

	/**
	 * A digest hash of the secret
	 */
	digest: string;

	/**
	 * The time this secret was created at
	 */
	created_at: Timestamp;

	/**
	 * Deployment IDs this secret is used by
	 */
	in_use_by: Id<'deployment'>[];
}

/**
 * The endpoints for projects
 * @public
 */
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
	  >
	| Endpoint<
			'POST',
			'/v1/projects/@this/tokens',
			{project_token: ProjectToken & {project: Project}},
			{flags: number}
	  >
	| Endpoint<
			'PUT',
			'/v1/projects/:project_id/secrets/:name',
			{secret: Secret},
			string
	  >
	| Endpoint<
			'PUT',
			'/v1/projects/@this/secrets/:name',
			{secret: Secret},
			string
	  >
	| Endpoint<'GET', '/v1/projects/:project_id/secrets', {secrets: Secret[]}>
	| Endpoint<'GET', '/v1/projects/@this/secrets', {secrets: Secret[]}>
	| Endpoint<'DELETE', '/v1/projects/:project_id/secrets/:secret_id', Empty>
	| Endpoint<'DELETE', '/v1/projects/@this/secrets/:secret_id', Empty>;
