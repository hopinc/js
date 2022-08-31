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

export function querystring(query: Query<string>) {
	return Object.entries(query).reduce((acc, [key, value]) => {
		if (value === undefined) {
			return acc;
		}

		const result = `${key}=${value.toString()}`;

		if (acc === '') {
			return result;
		}

		return acc + '&' + result;
	}, '');
}

export function createURLBuilder(base: string) {
	const regex = /:[^/?#]+/g;

	return <Path extends string>(path: Path, query: Query<Path>) => {
		query = {...query};

		const urlWithQuery = path.replace(regex, param => {
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
			? urlWithQuery
			: `${urlWithQuery}?${querystring(query as Query<string>)}`;

		return join(base, urlWithSearch);
	};
}
