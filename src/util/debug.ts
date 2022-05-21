declare const process: {env: Record<string, string>} | undefined;
declare const TSUP_DEBUG: boolean | undefined;

type DebugArgs = [() => unknown[]] | unknown[];

export function debug(...messages: DebugArgs) {
	if (
		typeof TSUP_DEBUG !== 'undefined' ||
		(typeof process !== 'undefined' && process?.env?.HOP_DEBUG === 'true')
	) {
		return;
	}

	const args = typeof messages[0] === 'function' ? messages[0]() : messages;

	console.debug('[HOP_DEBUG]', ...args);
}
