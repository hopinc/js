export const POSSIBLE_EVENTS: Record<
	string,
	{
		id: string;
		name: string;
	}[]
> = {
	Channels: [
		{
			id: 'channel.client.connected',
			name: 'Client Connected',
		},
		{
			id: 'channel.client.disconnected',
			name: 'Client Disconnected',
		},
		{
			id: 'channel.created',
			name: 'Created',
		},
		{
			id: 'channel.deleted',
			name: 'Deleted',
		},
		{
			id: 'channel.updated',
			name: 'Updated',
		},
	],
	Ignite: [
		{
			id: 'ignite.deployment.created',
			name: 'Deployment Created',
		},
		{
			id: 'ignite.deployment.updated',
			name: 'Deployment Updated',
		},
		{
			id: 'ignite.deployment.deleted',
			name: 'Deployment Deleted',
		},
		{
			id: 'ignite.deployment.build.started',
			name: 'Build Started',
		},
		{
			id: 'ignite.deployment.build.completed',
			name: 'Build Completed',
		},
		{
			id: 'ignite.deployment.build.created',
			name: 'Build Created',
		},
		{
			id: 'ignite.deployment.build.updated',
			name: 'Build Updated',
		},
		{
			id: 'ignite.deployment.build.failed',
			name: 'Build Failed',
		},
		{
			id: 'ignite.deployment.build.cancelled',
			name: 'Build Cancelled',
		},
		{
			id: 'ignite.deployment.deploy.validating',
			name: 'Deploy Validating',
		},
		{
			id: 'ignite.deployment.rollout.created',
			name: 'Rollout Created',
		},
		{
			id: 'ignite.deployment.rollout.updated',
			name: 'Rollout Updated',
		},
		{
			id: 'ignite.deployment.container.created',
			name: 'Container Created',
		},
		{
			id: 'ignite.deployment.container.updated',
			name: 'Container Updated',
		},
		{
			id: 'ignite.deployment.container.metrics_update',
			name: 'Container Metrics Update',
		},
		{
			id: 'ignite.deployment.container.deleted',
			name: 'Container Deleted',
		},
		{
			id: 'ignite.deployment.healthcheck.created',
			name: 'Healthcheck Created',
		},
		{
			id: 'ignite.deployment.healthcheck.updated',
			name: 'Healthcheck Updated',
		},
		{
			id: 'ignite.deployment.healthcheck.deleted',
			name: 'Healthcheck Deleted',
		},
		{
			id: 'ignite.deployment.healthcheck.events.failed',
			name: 'Healthcheck Events Failed',
		},
		{
			id: 'ignite.deployment.healthcheck.events.succeeded',
			name: 'Healthcheck Events Succeeded',
		},
		{
			id: 'ignite.deployment.gateway.created',
			name: 'Gateway Created',
		},
		{
			id: 'ignite.deployment.gateway.updated',
			name: 'Gateway Updated',
		},
		{
			id: 'ignite.deployment.gateway.deleted',
			name: 'Gateway Deleted',
		},
	],
	Project: [
		{
			id: 'project.member.created',
			name: 'Member Created',
		},
		{
			id: 'project.member.updated',
			name: 'Member Updated',
		},
		{
			id: 'project.member.deleted',
			name: 'Member Deleted',
		},
		{
			id: 'project.members.add',
			name: 'Member Added',
		},
		{
			id: 'project.members.remove',
			name: 'Member Removed',
		},
		{
			id: 'project.updated',
			name: 'Updated',
		},
		{
			id: 'project.tokens.create',
			name: 'Token Created',
		},
		{
			id: 'project.tokens.delete',
			name: 'Token Deleted',
		},
		{
			id: 'project.secrets.create',
			name: 'Secret Created',
		},
		{
			id: 'project.secrets.update',
			name: 'Secret Updated',
		},
		{
			id: 'project.secrets.delete',
			name: 'Secret Deleted',
		},
		{
			id: 'project.finance.transaction',
			name: 'Finance Transaction',
		},
	],
};