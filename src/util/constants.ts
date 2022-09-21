// Runtime specific globals
// only exist so we can have type safety in this file
declare const Bun: object | undefined;
declare const Deno: object | undefined;

/**
 * The default base URL for Hop's API.
 */
export const DEFAULT_BASE_URL = 'https://api.hop.io';

/**
 * If we are in the browser.
 */
export const IS_BROWSER = typeof window !== 'undefined';

export const SUPPORTS_INTL = typeof Intl !== 'undefined';
