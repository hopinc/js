// Runtime specific globals
// only exist so we can have type safety in this file
declare const Bun: object | undefined;
declare const Deno: object | undefined;

/**
 * The default base URL for Hop's API.
 * @public
 */
export const DEFAULT_BASE_URL = 'https://api.hop.io';

/**
 * If we are in the browser.
 * @public
 */
export const IS_BROWSER = typeof window !== 'undefined';

/**
 * If this runtiem supports the Intl API
 * @public
 */
export const SUPPORTS_INTL = typeof Intl !== 'undefined';
