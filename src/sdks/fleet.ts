import {create} from '@onehop/json-methods';
import type {FleetSchedulingState, Id, Node} from '..';
import {sdk} from './create';

export const fleet = sdk(client => {
	const Nodes = create<Node>().methods({
		async deleteNode() {
			return await fleetSDK.deleteNode(this.id, this.project_id);
		},

		async editNode(data: {schedulingState: FleetSchedulingState}) {
			return await fleetSDK.editNode(this.id, data, this.project_id);
		},

		async regenerateToken() {
			return await fleetSDK.regenerateToken(this.id, this.project_id);
		},
	});

	const fleetSDK = {
		async getNodes(projectId?: Id<'project'>) {
			if (client.authType !== 'ptk' && !projectId) {
				throw new Error(
					'Project ID is required for bearer or PAT authentication to get all fleet nodes.',
				);
			}

			const {nodes} = await client.get('/v1/fleet/nodes', {
				project: projectId,
			});

			return nodes.map(n => Nodes.from(n));
		},

		async createNode(
			name: string,
			schedulingState: FleetSchedulingState,
			projectId?: Id<'project'>,
		) {
			if (client.authType !== 'ptk' && !projectId) {
				throw new Error(
					'Project ID is required for bearer or PAT authentication to patch a fleet node.',
				);
			}

			const {node, token} = await client.post(
				'/v1/fleet/nodes',
				{
					name,
					scheduling_state: schedulingState,
				},
				{
					project: projectId,
				},
			);

			return {node: Nodes.from(node), token};
		},

		async regenerateToken(nodeId: Id<'fleet_node'>, projectId: Id<'project'>) {
			const {token} = await client.post(
				'/v1/fleet/nodes/:node_id/token',
				undefined,
				{
					node_id: nodeId,
					project: projectId,
				},
			);

			return token;
		},

		async editNode(
			nodeId: Id<'fleet_node'>,
			data: {
				schedulingState: FleetSchedulingState;
			},
			projectId?: Id<'project'>,
		) {
			if (client.authType !== 'ptk' && !projectId) {
				throw new Error(
					'Project ID is required for bearer or PAT authentication to edit a fleet node.',
				);
			}

			const {node} = await client.patch(
				'/v1/fleet/nodes/:node_id',
				{
					scheduling_state: data.schedulingState,
				},
				{
					node_id: nodeId,
					project: projectId,
				},
			);

			return node;
		},

		async deleteNode(nodeId: Id<'fleet_node'>, projectId?: Id<'project'>) {
			if (client.authType !== 'ptk' && !projectId) {
				throw new Error(
					'Project ID is required for bearer or PAT authentication to delete a fleet node.',
				);
			}

			await client.delete('/v1/fleet/nodes/:node_id', undefined, {
				node_id: nodeId,
			});
		},
	};

	return fleetSDK;
});
