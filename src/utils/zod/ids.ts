import {z} from 'zod';
import {type Id, type IdPrefixes, validateId} from '../../rest/index.ts';

/**
 * Generate a Zod schema for an ID prefix
 * @param prefix - Prefix of the ID
 * @returns A Zod schema that resolve to a valid ID
 * @public
 *
 * @example
 * ```ts
 * const patSchema = hopId('pat');
 * const pat = patSchema.parse(possiblyAPat);
 *
 * // `pat` is now a valid token typed as `Id<'pat'>`
 * pat; // => pat_NTIzNzY2NjU2NjU1ODkyNDk
 * ```
 */
export function hopId<Prefix extends IdPrefixes>(prefix: Prefix) {
	return z
		.string()
		.refine(
			(value): value is Id<Prefix> => validateId(value, prefix),
			`Id must be a valid \`${prefix}\` id`,
		);
}
