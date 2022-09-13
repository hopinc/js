import 'dotenv/config';

import assert from 'node:assert/strict';
import {test} from 'node:test';

import {id, Hop, RuntimeType, validateId} from '../src/index.js';

const BASE_URL =
	process.env.TEST_HOP_API_BASE_URL ?? 'https://api-staging.hop.io';

const hop = new Hop(
	id(process.env.HOP_TOKEN, ['ptk', 'bearer', 'pat']),
	BASE_URL,
);

test('The HTTP client correctly forms URLs', t => {
	t.todo('Move these tests to a describe() call');

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

test('It fetches the project members', async () => {
	const members = await hop.projects.getAllMembers();
	assert.ok(members.length > 0);
});

test('It gets all channels', async () => {
	const channels = await hop.channels.getAll();
	assert.ok(Array.isArray(channels));
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

// test('it creates a deployment', async t => {
// 	const redis = await hop.ignite.deployments.create({
// 		version: '2022-05-17',
// 		name: 'redis',
// 		image: {
// 			name: 'redis',
// 			auth: null,
// 			gh_repo: null,
// 		},
// 		container_strategy: 'manual',
// 		type: RuntimeType.PERSISTENT,
// 		env: {},
// 		resources: {
// 			vcpu: 0.5,
// 			ram: '128MB',
// 			vgpu: [],
// 		},
// 	});

// 	assert.ok(
// 		validateId(redis.id, 'deployment'),
// 		"Couldn't validate deployment ID",
// 	);

// 	assert.equal(redis.name, 'redis');
// 	assert.equal(typeof redis.created_at, 'string');
// 	assert.doesNotThrow(() => new Date(redis.created_at));

// 	t.todo('See if we can check the functions that exist on a deployment');

// 	assert.deepStrictEqual(redis, {
// 		config: {
// 			container_strategy: 'manual',
// 			env: {},
// 			image: {
// 				auth: null,
// 				name: 'redis:latest',
// 			},
// 			resources: {
// 				ram: '128mb',
// 				vcpu: 0.5,
// 			},
// 			restart_policy: 'on-failure',
// 			type: 'persistent',
// 			version: '2022-05-17',
// 		},
// 		name: 'redis',
// 		container_count: 0,

// 		// These values are dynamic and will change
// 		// so we can't really test them with .deepStrictEqual
// 		created_at: redis.created_at,
// 		id: redis.id,
// 		createContainer: redis.createContainer,
// 		createGateway: redis.createGateway,
// 		delete: redis.delete,
// 		getContainers: redis.getContainers,
// 	});

// 	// Cleanup
// 	await redis.delete();
// });
