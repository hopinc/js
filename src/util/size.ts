/**
 * API parsable byte size units strings
 * @public
 */
export const byteUnits = ['GB', 'MB', 'KB', 'B'] as const;

/**
 * Byte size unit type
 * @public
 */
export type ByteUnit = typeof byteUnits[number];

/**
 * A string representing a byte size
 * @public
 */
export type ByteSizeString = `${number}${ByteUnit}`;

/**
 * A string representing a byte size
 * @public
 * @deprecated use `ByteSizeString` instead
 */
export type ByteString = ByteSizeString;

/**
 * Validates if a string is a valid byte size string
 * @param value A string to validate if it is a valid byte size string
 * @returns If the string is a valid byte size string
 * @public
 */
export function isValidByteString(value: string): value is ByteSizeString {
	return byteUnits.some(unit => {
		if (!value.endsWith(unit)) {
			return false;
		}

		return !isNaN(parseFloat(value.slice(0, -unit.length)));
	});
}

const multipliers: Record<ByteUnit, number> = {
	B: 1,
	KB: 1024,
	MB: 1024 * 1024,
	GB: 1024 * 1024 * 1024,
};

/**
 * Helper function to converts a numerical size to a valid byte size string
 * @param size A size to convert to a valid byte size string
 * @param unit An optional unit to as the size unit. Defaults to B
 * @returns a byte size string
 * @public
 */
export function bytes(size: number, unit: ByteUnit = 'B'): ByteSizeString {
	return `${size}${unit}`;
}

/**
 * Converts a kilobyte size to a byte size string
 * @param size Kilobytes to convert to a byte size string
 * @returns a byte size string
 * @public
 */
export function kilobytes(size: number): ByteSizeString {
	return bytes(size, 'KB');
}

/**
 * Converts a megabyte size to a byte size string
 * @param size Megabytes to convert to a byte size string
 * @returns a byte size string
 * @public
 */
export function megabytes(size: number): ByteSizeString {
	return bytes(size, 'MB');
}

/**
 * Converts a gigabyte size to a byte size string
 * @param size Gigabytes to convert to a byte size string
 * @returns a byte size string
 * @public
 */
export function gigabytes(size: number): ByteSizeString {
	return bytes(size, 'GB');
}

/**
 * Parses a byte size string into bytes
 * @param size - The size of anything in gigabytes, megabytes, kilobytes or bytes
 * @public
 */
export function parseSize(size: string) {
	size = size.toUpperCase();

	const unit = byteUnits.find(u => size.endsWith(u));
	if (!unit) {
		throw new Error(`Invalid size: ${size}`);
	}

	const num = parseFloat(size.slice(0, -unit.length));
	if (isNaN(num)) {
		throw new Error(`Invalid size: ${size}`);
	}

	return multipliers[unit] * num;
}

/**
 * @deprecated use `byteUnits` instead
 * @public
 */
export const units = byteUnits;
