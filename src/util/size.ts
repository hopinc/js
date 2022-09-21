export const byteUnits = ['GB', 'MB', 'KB', 'B'] as const;

export type ByteUnit =
	| typeof byteUnits[number]
	| Uppercase<typeof byteUnits[number]>;

export type ByteSizeString = `${number}${ByteUnit}`;

/** @deprecated */
export type ByteString = ByteSizeString;

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
 * Parses a byte size string into bytes
 * @param size The size of anything in gigabytes, megabytes, kilobytes or bytes
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
 */
export const units = byteUnits;
