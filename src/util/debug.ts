import {blueBright} from 'colorette';

declare const process: {env: Record<string, string>} | undefined;

const USE_DEBUG =
	typeof process !== 'undefined' && process?.env?.HOP_DEBUG === 'true';

type DebugArgs = [() => unknown[]] | unknown[];

export function debug(...messages: DebugArgs) {
	if (!USE_DEBUG) {
		return;
	}

	const args = typeof messages[0] === 'function' ? messages[0]() : messages;

	console.debug(blueBright('[HOP_DEBUG]'), ...args);
}
