import type {Empty, Id, Timestamp} from '../../util/types.ts';
import type {Endpoint} from '../endpoints.ts';
import type {Project} from './projects.ts';

/**
 * Types that a channel can be
 * @public
 */
export enum ChannelType {
	PRIVATE = 'private',
	PUBLIC = 'public',
	UNPROTECTED = 'unprotected',
}

/**
 * Generic state type of a channel
 * @public
 */
export type AnyStateObject = Record<string, unknown>;

/**
 * @deprecated Use {@link AnyStateObject} instead
 * @public
 */
export type State = AnyStateObject;

/**
 * Definition of a channel
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
	state: AnyStateObject;

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

/**
 * A token for a channel
 * @public
 */
export interface ChannelToken {
	/**
	 * The ID for the token
	 */
	id: Id<'leap_token'>;

	/**
	 * State for this token
	 */
	state: AnyStateObject;

	/**
	 * The project this channel token is associated with
	 */
	project_id: Id<'project'>;

	/**
	 * If this token is currently online (e.g. active heartbeat and connected to leap)
	 */
	is_online: boolean;
}

/**
 * Endpoints for channels
 * @public
 */
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
			{state: AnyStateObject}
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
	| Endpoint<'PATCH', '/v1/channels/:channel_id/state', Empty, AnyStateObject>
	| Endpoint<'PUT', '/v1/channels/:channel_id/state', Empty, AnyStateObject>
	| Endpoint<'GET', '/v1/channels/:channel_id/state', {state: AnyStateObject}>
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
