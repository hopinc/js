import assert from 'node:assert';
import test from 'node:test';
import {FleetSchedulingState, type Hop} from '../src';

export function fleetTests(hop: Hop) {
	let createdNode: Awaited<ReturnType<typeof hop.fleet.createNode>>['node'];
	let nodesLength: number;

	test('It can create fleet node', async () => {
		const randomNodeName = `test-node-${Math.random()
			.toString(36)
			.substring(7)}`;
		const {node, token} = await hop.fleet.createNode(
			randomNodeName,
			FleetSchedulingState.SCHEDULABLE,
		);

		assert.ok(node);
		assert.ok(token.startsWith('fleet_token'));
		assert.equal(node.name, randomNodeName);
		assert.equal(node.scheduling_state, FleetSchedulingState.SCHEDULABLE);
		createdNode = node;
	});

	test('It can regenerate node token', async () => {
		const token = await createdNode.regenerateToken();

		assert.ok(token.startsWith('fleet_token'));
	});

	test('It can get all nodes', async () => {
		const nodes = await hop.fleet.getNodes();

		assert.ok(nodes.length > 0);
		assert.ok(nodes.find(n => createdNode.id === n.id));
		nodesLength = nodes.length;
	});

	test('It can edit node', async () => {
		const node = await createdNode.editNode({
			schedulingState: FleetSchedulingState.UNSCHEDULABLE,
		});

		assert.ok(node);
		assert.equal(node.scheduling_state, FleetSchedulingState.UNSCHEDULABLE);
	});

	test('It can delete a node', async () => {
		assert.doesNotThrow(async () => {
			await createdNode.deleteNode();

			const nodes = await hop.fleet.getNodes();
			assert.ok(nodesLength - 1 === nodes.length);
		});
	});
}
