import {formatList} from './lists.js';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Empty = void;

export type Tag<T, Name extends string> = T & {
	/**
	 * Mark a type as having a specific name in the API
	 * @internal
	 */
	___tag: Name;
};

/**
 * Hop's API uses ISO 8601 date strings
 */
export type Timestamp = Tag<string, 'timestamp'>;

export type ExtractRouteParams<T extends string> = string extends T
	? Record<string, string | number | undefined>
	: T extends `${string}:${infer Param}/${infer Rest}`
	? {[k in Param | keyof ExtractRouteParams<Rest>]: string | number}
	: T extends `${string}:${infer Param}`
	? {[k in Param]: string | number}
	: {};

export type Values<T> = T[keyof T];

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
	// Technically, yes, it should be here, but channel IDs can also
	// be any random string if a developer decides to set it
	// themselves. So I'll leave it commented for now..
	// {
	// 	prefix: 'channel',
	// 	description: 'Channel',
	// },
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
] as const;

export type IdPrefixes = typeof ID_PREFIXES[number]['prefix'];
export type Id<T extends IdPrefixes> = `${T}_${string}`;
export type HopShDomain = `${string}.hop.sh`;
export type InternalHopDomain = `${string}.hop`;
export type AnyId = Id<IdPrefixes>;

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
 * @param maybeId A string that might be an id
 * @param prefix Optionally an id prefix to check against
 * @returns true if the string is an id
 */
export function validateId<T extends IdPrefixes = IdPrefixes>(
	maybeId: string,
	prefix?: T | T[],
): maybeId is Id<T> {
	if (Array.isArray(prefix)) {
		return prefix.some(p => validateId(maybeId, p));
	}

	if (!prefix) {
		return ID_PREFIXES.some(({prefix}) => maybeId.startsWith(`${prefix}_`));
	}

	return maybeId.startsWith(`${prefix}_`);
}

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

export function id<T extends IdPrefixes = IdPrefixes>(
	maybeId?: string,
	prefix?: T | T[],
) {
	assertId(maybeId, prefix);
	return maybeId;
}

export function assertId<T extends IdPrefixes = IdPrefixes>(
	maybeId?: string,
	prefix?: T | T[],
	message?: string,
): asserts maybeId is Id<T> {
	const expectedPrefix =
		prefix === undefined
			? '<prefix>'
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
