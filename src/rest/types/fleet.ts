import type {Id} from '.';

/**
 * Fleet scheduling state (schedulable/unschedulable)
 */
export enum FleetSchedulingState {
	SCHEDULABLE = 'schedulable',
	UNSCHEDULABLE = 'unschedulable',
}

/**
 * Fleet status (online/offline)
 */
export enum FleetStatus {
	ONLINE = 'online',
	OFFLINE = 'offline',
}

/**
 * Fleet node
 */
export interface Node {
	/**
	 * Node ID
	 *
	 * @example "fleet_node_xxx"
	 */
	id: Id<'fleet_node'>;
	/**
	 * Project ID containing the node
	 *
	 * @example "project_xxx"
	 */
	project_id: Id<'project'>;
	/**
	 * Fleet group ID containing the node
	 *
	 * @example "fleet_group_xxx"
	 */
	fleet_group: Id<'fleet_group'> | null;
	/**
	 * Node name shown in the dashboard
	 */
	name: string;
	/**
	 * Scheduling state of the node (schedulable/unschedulable)
	 */
	scheduling_state: FleetSchedulingState;
	/**
	 * Status of the node (online/offline)
	 */
	status: FleetStatus;
	/**
	 * The last time the node sent a heartbeat (Used to determine if the node is alive)
	 */
	last_heartbeat: string;
	/**
	 * Node metadata
	 */
	metadata: NodeMetadata;

	/**
	 * Whether if the node is bootstrapped and initialized
	 */
	bootstrapped: boolean;
}

export interface NodeMetadata {
	/**
	 * The node's public IP addresses (includes IPv4 and IPv6)
	 */
	public_ips: NodeIP[];

	/**
	 * The country the node is located in
	 */
	country: string;

	/**
	 * The hostname of the node
	 */
	hostname: string;

	/**
	 * The node's architecture
	 *
	 * @example "x86_64"
	 */
	arch: string;

	/**
	 * The node's operating system version
	 */
	os: string;

	/**
	 * The engine used to run deployments on the node
	 *
	 * @example "podman"
	 */
	engine: 'podman';
}

export interface NodeIP {
	/**
	 * IP Address
	 */
	ip: string;

	/**
	 * IP Address Type
	 */
	type: 'ipv4' | 'ipv6';
}
