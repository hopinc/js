/**
 * The default base URL for Hop's API.
 */
export const DEFAULT_BASE_URL = 'https://api.hop.io';

/**
 * If we are in the browser.
 */
export const IS_BROWSER = typeof window !== 'undefined';

/**
 * If we are in Node.js.
 */
export const IS_NODE =
	typeof process !== 'undefined' &&
	process.versions != null &&
	process.versions.node != null;
