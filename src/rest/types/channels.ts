import {Endpoint} from '../endpoints.js';
import {Project} from './projects.js';
import {Empty, Id, Timestamp} from '../../util/types.js';

export enum ChannelType {
	PRIVATE = 'private',
	PUBLIC = 'public',
	UNPROTECTED = 'unprotected',
}

/**
 * Generic state type of a channel
 * @public
 */
export type State = Record<string, unknown>;

/**
 * @public
 */
export interface Channel {
	/**
	 * The ID of the channel
	 */
	id: string;

	/**
	 * The project it is associated with
	 */
	project: Project;

	/**
	 * State metadata
	 */
	state: State;

	/**
	 * Capabilities of the channel
	 */
	capabilities: number;

	/**
	 * When this channel was created
	 */
	created_at: Timestamp;

	/**
	 * The type of this channel
	 */
	type: ChannelType;
}

export interface ChannelToken {
	/**
	 * The ID for the token
	 */
	id: Id<'leap_token'>;

	/**
	 * State for this token
	 */
	state: State;

	/**
	 * The project this channel token is associated with
	 */
	project_id: Id<'project'>;

	/**
	 * If this token is currently online (e.g. active heartbeat and connected to leap)
	 */
	is_online: boolean;
}

export type ChannelEndpoints =
	| Endpoint<
			'POST',
			'/v1/channels',
			{channel: Channel},
			{type: ChannelType; state: Record<string, any> | null}
	  >
	| Endpoint<
			'PUT',
			'/v1/channels/:channel_id',
			{channel: Channel},
			{type: ChannelType; state: Record<string, any> | null}
	  >
	| Endpoint<
			'POST',
			'/v1/channels/tokens',
			{token: ChannelToken},
			{state: State}
	  >
	| Endpoint<'DELETE', '/v1/channels/:channel_id', Empty>
	| Endpoint<'GET', '/v1/channels/:channel_id', {channel: Channel}>
	| Endpoint<'GET', '/v1/channels/:channel_id/tokens', {tokens: ChannelToken[]}>
	| Endpoint<
			'POST',
			'/v1/channels/tokens/:token/messages',
			Empty,
			{e: string; d: unknown}
	  >
	| Endpoint<'PUT', '/v1/channels/:channel_id/subscribers/:token', Empty>
	| Endpoint<'PATCH', '/v1/channels/:channel_id/state', Empty, State>
	| Endpoint<'PUT', '/v1/channels/:channel_id/state', Empty, State>
	| Endpoint<'GET', '/v1/channels/:channel_id/state', {state: State}>
	| Endpoint<
			'POST',
			'/v1/channels/:channel_id/messages',
			Empty,
			{e: string; d: unknown}
	  >
	| Endpoint<'GET', '/v1/channels', {channels: Channel[]}>
	| Endpoint<'GET', '/v1/channels/tokens/:token', {token: ChannelToken}>
	| Endpoint<
			'PATCH',
			'/v1/channels/tokens/:token',
			{token: ChannelToken},
			{expiresAt?: Timestamp | null; state: ChannelToken['state']}
	  >
	| Endpoint<'DELETE', '/v1/channels/tokens/:token', Empty>
	| Endpoint<
			'GET',
			'/v1/channels/:channel_id/stats',
			{stats: {online_count: number}}
	  >;
