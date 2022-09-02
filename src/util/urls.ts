import {ExtractRouteParams, Query} from '../rest/index.js';

export function lead(x: string) {
	return x.charCodeAt(0) === 47 ? x : '/' + x;
}

export function isObjectEmpty(object: object) {
	for (const _ in object) {
		return false;
	}

	return true;
}

export function join(a: string, b: string) {
	return a + lead(b);
}

/**
 * Generates a querystring to append to a URL. This function will include the ? character.
 * @param query An object of query params to be encoded
 * @returns A string of query params
 */
export function querystring(query: Query<string>): string {
	const usefulQuery = Object.entries(query).filter(
		(entry): entry is [string, string | number] => {
			const [, value] = entry;

			return value !== undefined;
		},
	);

	if (usefulQuery.length === 0) {
		return '';
	}

	const INITIAL_QUERYSTRING = '?';

	return usefulQuery.reduce((acc, [key, value]) => {
		if (value === undefined) {
			return acc;
		}

		const result = `${key}=${value.toString()}`;

		if (acc === INITIAL_QUERYSTRING) {
			return INITIAL_QUERYSTRING + result;
		}

		return acc + '&' + result;
	}, INITIAL_QUERYSTRING);
}

export function createURLBuilder(base: string) {
	const regex = /:[^/?#]+/g;

	return <Path extends string>(path: Path, query: Query<Path>) => {
		query = {...query};

		const urlWithParams = path.replace(regex, param => {
			param = param.substring(1);

			if (param in query) {
				const {[param]: value, ...rest} = query;
				query = rest as ExtractRouteParams<Path>;

				if (value === undefined) {
					throw new Error(`URL param ${param} is undefined`);
				}

				if (typeof value === 'number') {
					return value.toString();
				}

				return value;
			}

			throw new Error(`Missing param ${param}.`);
		});

		const urlWithSearch = isObjectEmpty(query)
			? urlWithParams
			: `${urlWithParams}${querystring(query as Query<string>)}`;

		console.log(urlWithSearch);

		return join(base, urlWithSearch);
	};
}
