import {z} from 'zod';
import {Id, IdPrefixes, validateId} from '../../rest';

/**
 * Generate a Zod schema for an ID prefix
 * @param prefix Prefix of the ID
 * @returns A Zod schema that resolve to a valid ID
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
			`Id must be a valid ${prefix} id`,
		);
}
