import assert from 'node:assert';
import test from 'node:test';
import type {Hop} from '../src';

// Todo: add other tests

export function channelsTests(hop: Hop) {
	test('It gets all channels', async () => {
		const channels = await hop.channels.getAll();
		assert.ok(Array.isArray(channels));
	});
}
