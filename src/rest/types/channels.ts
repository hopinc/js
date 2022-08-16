import {Endpoint} from '../endpoints';
import {Project} from './projects';
import {Empty, Id, Timestamp} from '../../util/types';

export enum ChannelType {
	PRIVATE = 'private',
	PUBLIC = 'public',
	UNPROTECTED = 'unprotected',
}

export type State = Record<string, unknown>;

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
}

export type ChannelEndpoints =
	| Endpoint<'POST', '/v1/channels', {channel: Channel}, {type: ChannelType}>
	| Endpoint<
			'PUT',
			'/v1/channels/:channel_id',
			{channel: Channel},
			{type: ChannelType}
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
	| Endpoint<'GET', '/v1/channels', {channels: Channel[]}>;
