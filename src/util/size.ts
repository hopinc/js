const units = ['gb', 'mb', 'kb', 'b'];

/**
 * Parses a byte size string into bytes
 * @param size The size of anything in gigabytes, megabytes, kilobytes or bytes
 */
export function parseSize(size: string) {
	size = size.toLowerCase();

	const unit = units.find(u => size.endsWith(u));
	if (!unit) {
		throw new Error(`Invalid size: ${size}`);
	}

	const num = parseFloat(size.slice(0, -unit.length));
	if (isNaN(num)) {
		throw new Error(`Invalid size: ${size}`);
	}

	switch (unit.toLowerCase()) {
		case 'gb':
			return num * 1024 * 1024 * 1024;
		case 'mb':
			return num * 1024 * 1024;
		case 'kb':
			return num * 1024;
		case 'b':
			return num;
		default:
			return num;
	}
}
