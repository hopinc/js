import {formatList} from './lists.ts';
import type {POSSIBLE_EVENTS} from './webhooks.ts';

/**
 * All methods the Hop API accepts
 * @public
 */
export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * An empty response type
 * @public
 */
export type Empty = void;

/**
 * Makes individual properties optional in a type
 * @public
 */
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
	Partial<Pick<T, K>>;

/**
 * Tag a type to make it unique
 * @public
 */
export type Tag<T, Name extends string> = T & {
	/**
	 * Mark a type as having a specific name in the API
	 * @internal
	 */
	___tag: Name;
};

/**
 * An ISO 8601 date strings
 * @public
 */
export type Timestamp = Tag<string, 'timestamp'>;

/**
 * Creates a record of params required for a given URL/path
 * @public
 */
export type ExtractRouteParams<T extends string> = string extends T
	? Record<string, string | number | undefined>
	: T extends `${string}:${infer Param}/${infer Rest}`
	? {[k in Param | keyof ExtractRouteParams<Rest>]: string | number}
	: T extends `${string}:${infer Param}`
	? {[k in Param]: string | number}
	: {};

// Technically, `channel`, it should be here, but channel IDs can also
// be any random string if a developer decides to set it. For this reason,
// channel is not included as a valid ID in this list
/**
 * An array of all IDs that can be used in the API
 * @public
 */
export const ID_PREFIXES = [
	{
		prefix: 'user',
		description: 'Users',
	},
	{
		prefix: 'project',
		description: 'Project',
	},
	{
		prefix: 'pm',
		description: 'Project Members',
	},
	{
		prefix: 'role',
		description: 'Roles',
	},
	{
		prefix: 'pi',
		description: 'Project Invite',
	},
	{
		prefix: 'ptk',
		description: 'Project token',
	},
	{
		prefix: 'pat',
		description: 'User personal access token',
	},
	{
		prefix: 'container',
		description: 'Ignite container',
	},
	{
		prefix: 'pipe_room',
		description: 'Pipe room',
	},
	{
		prefix: 'deployment',
		description: 'Ignite deployment',
	},
	{
		prefix: 'bearer',
		description: 'Users bearer token',
	},
	{
		prefix: 'ptkid',
		description: 'Project token ID',
	},
	{
		prefix: 'secret',
		description: 'Project secret ID',
	},
	{
		prefix: 'gateway',
		description: 'Gateway',
	},
	{
		prefix: 'domain',
		description: 'Domain for a gateway',
	},
	{
		prefix: 'leap_token',
		description: 'Token for connecting to leap as a client',
	},
	{
		prefix: 'build',
		description: 'Build ID for build logs',
	},
	{
		prefix: 'rollout',
		description: 'Rollout ID for rollouts.',
	},
	{
		prefix: 'health_check',
		description: 'Health check ID for health checks.',
	},
	{
		prefix: 'session',
		description: 'Session ID for sessions on your account.',
	},
	{
		prefix: 'webhook',
		description: 'Webhook ID for webhooks on a project.',
	},
	{
		prefix: 'event',
		description: 'Event ID for events sent by webhooks on a project.',
	},
] as const;

/**
 * A union of all ID prefixes used within the API
 * @public
 */
export type IdPrefixes = (typeof ID_PREFIXES)[number]['prefix'];

/**
 * A Hop ID is a string that starts with a prefix and a underscore, followed by some unique text.
 * It is a Pika ID — https://github.com/hopinc/pika
 * @public
 */
export type Id<T extends IdPrefixes> = `${T}_${string}`;

/**
 * A hop.sh domain (*.hop.sh)
 * @public
 */
export type HopShDomain = `${string}.hop.sh`;

/**
 * A domain used with internal gateways (*.hop.sh)
 * @public
 */
export type InternalHopDomain = `${string}.hop`;

/**
 * Any/all IDs that are used within the API
 * @public
 */
export type AnyId = Id<IdPrefixes>;

/**
 * A union of all possible webhook groups
 */
export type PossibleWebhookGroups = keyof typeof POSSIBLE_EVENTS;

/**
 * A union of all possible webhook event IDs
 */
export type PossibleWebhookIDs =
	(typeof POSSIBLE_EVENTS)[PossibleWebhookGroups][number]['id'];

/**
 * Checks if a string is a valid Hop ID prefix
 *
 * @public
 * @param prefix - A string that is a potential prefix
 * @param expect - An expected prefix to check against
 * @returns - Whether the prefix is valid
 */
export function validateIdPrefix<T extends IdPrefixes = IdPrefixes>(
	prefix: string,
	expect?: T,
): prefix is T {
	if (expect) {
		return prefix === expect;
	}

	return ID_PREFIXES.some(({prefix: p}) => p === prefix);
}

/**
 * Validates that a string is a valid ID
 *
 * @public
 * @param maybeId - A string that might be an id
 * @param prefix - Optionally an id prefix to check against
 * @returns true if the string is an id
 */
export function validateId<T extends IdPrefixes = IdPrefixes>(
	maybeId: string | undefined | null,
	prefix?: T | T[],
): maybeId is Id<T> {
	if (Array.isArray(prefix)) {
		return prefix.some(p => validateId(maybeId, p));
	}

	if (!maybeId) {
		return false;
	}

	if (!prefix) {
		return ID_PREFIXES.some(({prefix}) => maybeId.startsWith(`${prefix}_`));
	}

	return maybeId.startsWith(`${prefix}_`);
}

/**
 * Gets the prefix of an ID
 *
 * @public
 * @param id - A full ID to extract the prefix from
 * @param expect - An expected prefix to check against
 * @returns - The prefix of the ID
 */
export function getIdPrefix<T extends IdPrefixes>(id: string, expect?: T) {
	if (expect && !validateId(id, expect)) {
		throw new Error(`Expected ${id} to be an id of type ${expect}`);
	}

	const [prefix] = id.split('_');

	if (!prefix || !validateIdPrefix(prefix, expect)) {
		const message = expect
			? `Expected ${id} to be a valid id with a prefix \`${expect}\`.`
			: `Expected ${id} to be a valid id. Found prefix \`${prefix}\`.`;

		throw new Error(message);
	}

	return prefix;
}

/**
 * Casts a string to an ID and asserts that it is of the correct type.
 * This function will throw if the string is not a valid ID.
 *
 * @public
 * @param maybeId - Cast and assert that a string is an id
 * @param prefix - Optionally an prefix or array of prefixes to check against
 * @returns - The ID cast to the correct type
 */
export function id<T extends IdPrefixes = IdPrefixes>(
	maybeId: string | undefined | null,
	prefix?: T | T[],
): Id<T> {
	assertId(maybeId, prefix);
	return maybeId;
}

/**
 * Asserts that a string is a valid ID
 * @public
 * @param maybeId - A string that is possibly an ID
 * @param prefix - A prefix or array of prefixes to check against
 * @param message - An error message to throw if the ID is invalid
 */
export function assertId<T extends IdPrefixes = IdPrefixes>(
	maybeId: string | undefined | null,
	prefix?: T | T[],
	message?: string,
): asserts maybeId is Id<T> {
	const expectedPrefix =
		prefix === undefined
			? '<any prefix>'
			: Array.isArray(prefix)
			? formatList(prefix, 'disjunction')
			: prefix;

	if (!maybeId) {
		throw new Error(
			message ??
				`No value specified trying to assert an ID. Expected \`${expectedPrefix}\` and found ${maybeId}.`,
		);
	}

	if (!validateId(maybeId, prefix)) {
		const expectedPrefix =
			prefix === undefined
				? undefined
				: Array.isArray(prefix)
				? formatList(prefix, 'disjunction')
				: prefix;

		throw new Error(
			message ?? `Invalid id: ${maybeId}. Expected \`${expectedPrefix}\`.`,
		);
	}
}
