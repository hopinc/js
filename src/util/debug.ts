import {blueBright} from 'colorette';

declare const process: {env: Record<string, string>} | undefined;

const USE_DEBUG =
	typeof process !== 'undefined' && process?.env?.HOP_DEBUG === 'true';

export function debug(...messages: unknown[]) {
	if (!USE_DEBUG) {
		return;
	}

	console.debug(blueBright('[HOP_DEBUG]'), ...messages);
}
