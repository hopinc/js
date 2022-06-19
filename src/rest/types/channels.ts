import {Endpoint} from '../endpoints';
import {Project} from './projects';
import {Id, Timestamp} from './types';

export enum ChannelType {
	PRIVATE,
	PUBLIC,
	UNPROTECTED,
}

export type State = Record<string, unknown>;

export interface Channel {
	/**
	 * The ID of the channel
	 */
	id: Id<'channel'>;

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

export type ChannelEndpoints = Endpoint<
	'POST',
	'/v1/channels',
	{channel: Channel},
	{type: ChannelType}
>;
