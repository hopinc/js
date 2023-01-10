import * as sdks from './sdks/index.ts';

export * from './hop.ts';
export * from './permissions.ts';
export * from './rest/index.ts';
// Commonly used in the API, so nice to export in two place
export {type APIAuthentication} from './rest/index.ts';
export type {
	Channel,
	ChannelToken,
	Container,
	ContainerLog,
	DeliveryProtocol,
	Deployment,
	Gateway,
	GatewayType,
	Member,
	MemberRole,
	PAT,
	Project,
	ProjectToken,
	Room,
	Secret,
	State,
	User,
} from './rest/index.ts';
export {ChannelType} from './rest/types/channels.ts';
export {
	ContainerState,
	RestartPolicy,
	RolloutState,
	RuntimeType,
} from './rest/types/ignite.ts';
export * from './util/index.ts';
export {
	/**
	 * SDKs for interacting with Hop's API. You can use these, but it's
	 * recommended to use the `Hop` class directly, which wraps
	 * these SDKs and provides a more convenient interface.
	 * @public
	 */
	sdks,
};
