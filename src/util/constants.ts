import {APIClientOptions, transports} from '../rest';

/**
 * The default base URL for Hop's API.
 */
export const DEFAULT_BASE_URL = 'https://api.hop.io';

/**
 * If we are in the browser.
 */
export const IS_BROWSER = typeof window !== 'undefined';

export const DEFAULT_API_OPTIONS: Omit<APIClientOptions, 'authentication'> = {
	transport: transports.fetch,
	baseUrl: DEFAULT_BASE_URL,
};
