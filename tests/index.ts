import 'dotenv/config';

import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Hop, id, validateId} from '../src/index.ts';
import {channelsTests} from './channels.ts';
import {fleetTests} from './fleet.ts';
import {membersTest} from './projects/members.ts';
import {webhookTests} from './projects/webhooks.ts';

const SDK_TESTS = [webhookTests, membersTest, fleetTests, channelsTests];

// @ts-expect-error This is usually injected by tsup
globalThis.TSUP_IS_NODE = true;

const BASE_URL = process.env.TEST_HOP_API_BASE_URL ?? 'https://api.hop.io';

const hop = new Hop(
	id(process.env.HOP_TOKEN, ['ptk', 'bearer', 'pat']),
	BASE_URL,
);

test('The HTTP client correctly forms URLs', () => {
	assert.equal(
		hop.client.url('/v1/path/to/:resource', {
			resource: 'my-resource',
			limit: 20,
			skip: 20,
		}),
		BASE_URL + '/v1/path/to/my-resource?limit=20&skip=20',
	);

	assert.equal(
		hop.client.url('/v1/path/to/:resource', {
			resource: 'my-resource',
			limit: 20,
		}),
		BASE_URL + '/v1/path/to/my-resource?limit=20',
	);

	assert.equal(
		hop.client.url('/v1/path/to/:resource/:param', {
			resource: 'my-resource',
			param: 'param2',
			limit: 20,
		}),
		BASE_URL + '/v1/path/to/my-resource/param2?limit=20',
	);
});

test('The HTTP client can make a request', async () => {
	await assert.doesNotReject(() => hop.client.get('/v1/channels', {}));
});

test('It validates an ID', () => {
	assert.ok(validateId('ptk_1234567890'));
	assert.ok(validateId('ptk_1234567890', 'ptk'));
	assert.ok(validateId('leap_token_1234567890', 'leap_token'));
	assert.ok(validateId('leap_token_1234567890', ['leap_token', 'bearer']));
});

test('It validates that the token is valid', () => {
	assert(validateId('ptk_testing', 'ptk'), "Couldn't validate Project Token");
});

for (const SDKTest of SDK_TESTS) {
	SDKTest(hop);
}
