import test from 'node:test';
import type {Hop} from '../../src';
import assert from 'node:assert';

export function membersTest(hop: Hop) {
	test('It fetches the project members', async () => {
		const members = await hop.projects.getAllMembers();
		assert.ok(members.length > 0);
	});
}
