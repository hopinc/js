import {ByteString} from '../../util';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

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

export const ID_PREFIXES = [
	{
		prefix: 'user',
		description: 'Users',
	},
	{
		prefix: 'team',
		description: 'Teams',
	},
	{
		prefix: 'tm',
		description: 'Team Members',
	},
	{
		prefix: 'role',
		description: 'Roles',
	},
	{
		prefix: 'ti',
		description: 'Team Invite',
	},
	{
		prefix: 'sk',
		description: 'Secret Key',
	},
	{
		prefix: 'pat',
		description: 'Team members personal access token',
	},
	{
		prefix: 'container',
		description: 'Ignite container',
	},
	{
		prefix: 'stream',
		description: 'Pipe stream',
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
		prefix: 'skid',
		description: 'Secret key ID',
	},
] as const;

export type IdPrefixes = typeof ID_PREFIXES[number]['prefix'];
export type Id<T extends IdPrefixes> = `${T}_${string}`;
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
	prefix?: T,
): maybeId is Id<T> {
	if (!prefix) {
		return ID_PREFIXES.some(({prefix}) => maybeId.startsWith(`${prefix}_`));
	}

	return maybeId.startsWith(prefix);
}

export function getIdPrefix<T extends IdPrefixes>(id: string, expect?: T) {
	if (expect && !validateId(id, expect)) {
		throw new Error(`Expected ${id} to be an id of type ${expect}`);
	}

	const [prefix] = id.split('_');

	if (!prefix || !validateIdPrefix(prefix, expect)) {
		const message = expect
			? `Expected ${id} to be a valid id of type ${expect}`
			: `Expected ${id} to be a valid id. Found prefix \`${prefix}\`.`;

		throw new Error(message);
	}

	return prefix;
}

/**
 * Casts a variable into a string for TypeScript
 * @param id The variable to cast into an id
 * @param prefix The type of id to cast to
 * @returns A valid id string
 *
 * @example
 * ```ts
 * declare function createContainer(id: Id<'container'>): void
 * declare const containerId: string;
 *
 * // Error, string cannot be assigned to Id<'container'>
 * createContainer(containerId);
 *
 * // Successfully casts and compiles
 * createContainer(asId(containerId, 'container'));
 * ```
 */
export function asId<T extends IdPrefixes>(id: string, prefix: T) {
	return id as Id<T>;
}

export const id = asId;

export function assertId<T extends IdPrefixes = IdPrefixes>(
	maybeId: string,
	prefix?: T,
	message?: string,
): asserts maybeId is Id<T> {
	if (!validateId(maybeId, prefix)) {
		throw new Error(
			message ?? `Invalid id: ${maybeId}. Expected ${prefix}_{string}`,
		);
	}
}
