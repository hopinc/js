import assert from 'node:assert';
import test from 'node:test';
import {ChannelType, type Hop} from '../src';

export function channelsTests(hop: Hop) {
	let channel_id: string;

	test('It can create a channel', async () => {
		const randomString = Math.random().toString(36).substring(7);
		const channel = await hop.channels.create(ChannelType.PUBLIC, randomString);

		channel_id = channel.id;
		assert.ok(channel.id);
		assert.equal(channel.id, randomString);
		assert.equal(channel.type, ChannelType.PUBLIC);
	});

	test('It gets all channels', async () => {
		const channels = await hop.channels.getAll();
		assert.ok(Array.isArray(channels));
		assert.ok(channels.some(channel => channel.id === channel_id));
	});

	test('It can set channel state', async () => {
		await hop.channels.setState(channel_id, {
			new_state: 'hello',
		});

		const channel = await hop.channels.get(channel_id);

		assert.equal(channel.state.new_state, 'hello');
	});

	test('it can patch channel state', async () => {
		await hop.channels.patchState(channel_id, {
			new_state: 'world',
		});

		const channel = await hop.channels.get(channel_id);
		assert.equal(channel.state.new_state, 'world');
	});

	test('It can delete a channel', async () => {
		await hop.channels.delete(channel_id);

		const channels = await hop.channels.getAll();
		assert.ok(!channels.some(channel => channel.id === channel_id));
	});
}
