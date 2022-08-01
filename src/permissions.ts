export enum PROJECT_PERMISSION {
	ADD_MEMBER = 'add_member',
	REMOVE_MEMBER = 'remove_member',
	GET_PROJECT_MEMBERS = 'get_project_members',
	DELETE_PROJECT = 'delete_project',
	DELETE_DEPLOYMENT = 'delete_deployment',
	DELETE_CONTAINER = 'delete_container',
	UPDATE_CONTAINER_STATE = 'update_container_state',
	READ_DEPLOYMENTS = 'read_deployments',
	CREATE_DEPLOYMENT = 'create_deployment',
	CREATE_CONTAINER = 'create_container',
	UPDATE_CONTAINER_CONFIG = 'update_container_config',
	CREATE_ROOM = 'create_room',
	READ_ROOM = 'read_room',
	DELETE_ROOM = 'delete_room',
	CREATE_ROOM_PRODUCER = 'create_room_producer',
	CREATE_PROJECT_TOKEN = 'create_project_token',
	DELETE_PROJECT_TOKEN = 'delete_project_token',
	READ_PROJECT_TOKENS = 'read_project_tokens',
	READ_CONTAINER_LOGS = 'read_container_logs',
	CREATE_PROJECT_SECRET = 'create_project_secret',
	READ_PROJECT_SECRETS = 'read_project_secrets',
	DELETE_PROJECT_SECRET = 'delete_project_secret',
	GET_REGISTRY_IMAGES = 'get_registry_images',
	CREATE_CHANNEL = 'create_channel',
	CREATE_CHANNEL_TOKEN = 'create_channel_token',
	CREATE_LEAP_TOKEN = 'create_leap_token',
	CREATE_GATEWAY = 'create_gateway',
	ADD_DOMAIN = 'add_domain',
	DELETE_CHANNELS = 'delete_channels',
	UPDATE_CHANNEL_STATE = 'update_channel_state',
	PUBLISH_CHANNEL_MESSAGES = 'publish_channel_messages',
	READ_CHANNELS = 'read_channels',
	READ_LEAP_TOKENS = 'read_leap_tokens',
	MANAGE_CHANNEL_SUBSCRIBERS = 'manage_channel_subscribers',
	UPDATE_LEAP_TOKEN = 'update_leap_token',
	DELETE_DOMAIN = 'delete_domain',
	DELETE_GATEWAY = 'delete_gateway',
	GET_INTERNAL_DOMAIN = 'get_internal_domain',
	MESSAGE_TOKEN = 'message_token',
	ROLLOUT = 'rollout',
	REQUEST_QUOTA_INCREASE = 'request_quota_increase',
	READ_BILLING = 'read_billing',
	READ_GATEWAYS = 'read_gateways',
	DELETE_REGISTRY_IMAGES = 'delete_registry_images',
}

export const permissionsMap = {
	[PROJECT_PERMISSION.ADD_MEMBER]: 1n << 0n,
	[PROJECT_PERMISSION.REMOVE_MEMBER]: 1n << 1n,
	[PROJECT_PERMISSION.GET_PROJECT_MEMBERS]: 1n << 2n,
	[PROJECT_PERMISSION.DELETE_PROJECT]: 1n << 3n,
	[PROJECT_PERMISSION.DELETE_DEPLOYMENT]: 1n << 4n,
	[PROJECT_PERMISSION.DELETE_CONTAINER]: 1n << 5n,
	[PROJECT_PERMISSION.UPDATE_CONTAINER_STATE]: 1n << 6n,
	[PROJECT_PERMISSION.READ_DEPLOYMENTS]: 1n << 7n,
	[PROJECT_PERMISSION.CREATE_DEPLOYMENT]: 1n << 8n,
	[PROJECT_PERMISSION.CREATE_CONTAINER]: 1n << 9n,
	[PROJECT_PERMISSION.UPDATE_CONTAINER_CONFIG]: 1n << 10n,
	[PROJECT_PERMISSION.CREATE_ROOM]: 1n << 11n,
	[PROJECT_PERMISSION.READ_ROOM]: 1n << 12n,
	[PROJECT_PERMISSION.DELETE_ROOM]: 1n << 13n,
	[PROJECT_PERMISSION.CREATE_ROOM_PRODUCER]: 1n << 14n,
	[PROJECT_PERMISSION.CREATE_PROJECT_TOKEN]: 1n << 15n,
	[PROJECT_PERMISSION.DELETE_PROJECT_TOKEN]: 1n << 16n,
	[PROJECT_PERMISSION.READ_PROJECT_TOKENS]: 1n << 17n,
	[PROJECT_PERMISSION.READ_CONTAINER_LOGS]: 1n << 18n,
	[PROJECT_PERMISSION.CREATE_PROJECT_SECRET]: 1n << 19n,
	[PROJECT_PERMISSION.READ_PROJECT_SECRETS]: 1n << 20n,
	[PROJECT_PERMISSION.DELETE_PROJECT_SECRET]: 1n << 21n,
	[PROJECT_PERMISSION.GET_REGISTRY_IMAGES]: 1n << 22n,
	[PROJECT_PERMISSION.CREATE_CHANNEL_TOKEN]: 1n << 24n,
	[PROJECT_PERMISSION.CREATE_GATEWAY]: 1n << 25n,
	[PROJECT_PERMISSION.ADD_DOMAIN]: 1n << 26n,
	[PROJECT_PERMISSION.DELETE_CHANNELS]: 1n << 27n,
	[PROJECT_PERMISSION.UPDATE_CHANNEL_STATE]: 1n << 28n,
	[PROJECT_PERMISSION.READ_CHANNELS]: 1n << 29n,
	[PROJECT_PERMISSION.PUBLISH_CHANNEL_MESSAGES]: 1n << 30n,
	[PROJECT_PERMISSION.MANAGE_CHANNEL_SUBSCRIBERS]: 1n << 31n,
	[PROJECT_PERMISSION.DELETE_DOMAIN]: 1n << 32n,
	[PROJECT_PERMISSION.DELETE_GATEWAY]: 1n << 33n,
	[PROJECT_PERMISSION.GET_INTERNAL_DOMAIN]: 1n << 34n,
	[PROJECT_PERMISSION.CREATE_LEAP_TOKEN]: 1n << 35n,
	[PROJECT_PERMISSION.READ_LEAP_TOKENS]: 1n << 36n,
	[PROJECT_PERMISSION.UPDATE_LEAP_TOKEN]: 1n << 37n,
	[PROJECT_PERMISSION.MESSAGE_TOKEN]: 1n << 38n,
	[PROJECT_PERMISSION.CREATE_CHANNEL]: 1n << 39n,
	[PROJECT_PERMISSION.ROLLOUT]: 1n << 40n,
	[PROJECT_PERMISSION.REQUEST_QUOTA_INCREASE]: 1n << 41n,
	[PROJECT_PERMISSION.READ_BILLING]: 1n << 42n,
	[PROJECT_PERMISSION.READ_GATEWAYS]: 1n << 43n,
	[PROJECT_PERMISSION.DELETE_REGISTRY_IMAGES]: 1n << 44n,
};

export const BROAD_PERMISSIONS_MAP = {
	MANAGE_MEMBERS:
		permissionsMap.add_member |
		permissionsMap.remove_member |
		permissionsMap.get_project_members,
	MANAGE_PROJECT_TOKENS:
		permissionsMap.create_project_token |
		permissionsMap.delete_project_token |
		permissionsMap.read_project_tokens,
	MANAGE_DEPLOYMENTS:
		permissionsMap.create_container |
		permissionsMap.delete_container |
		permissionsMap.update_container_state |
		permissionsMap.read_container_logs |
		permissionsMap.update_container_config |
		permissionsMap.add_domain |
		permissionsMap.delete_domain |
		permissionsMap.create_deployment |
		permissionsMap.delete_deployment |
		permissionsMap.read_deployments |
		permissionsMap.rollout |
		permissionsMap.delete_gateway |
		permissionsMap.get_internal_domain,
	MANAGE_PIPE:
		permissionsMap.create_room |
		permissionsMap.delete_room |
		permissionsMap.read_room,
	MANAGE_SECRETS:
		permissionsMap.create_project_secret |
		permissionsMap.delete_project_secret |
		permissionsMap.read_project_secrets,
	MANAGE_CHANNELS:
		permissionsMap.create_leap_token |
		permissionsMap.create_channel_token |
		permissionsMap.create_gateway |
		permissionsMap.read_leap_tokens |
		permissionsMap.update_leap_token |
		permissionsMap.create_channel |
		permissionsMap.delete_channels |
		permissionsMap.update_channel_state |
		permissionsMap.read_channels |
		permissionsMap.publish_channel_messages |
		permissionsMap.manage_channel_subscribers |
		permissionsMap.message_token,
	MANAGE_REGISTRY:
		permissionsMap.get_registry_images | permissionsMap.delete_registry_images,
	READ_ONLY:
		permissionsMap.read_deployments |
		permissionsMap.read_container_logs |
		permissionsMap.read_room |
		permissionsMap.read_channels |
		permissionsMap.read_project_tokens |
		permissionsMap.read_project_secrets |
		permissionsMap.read_leap_tokens |
		permissionsMap.get_project_members |
		permissionsMap.read_gateways,
	MANAGE_QUOTAS: permissionsMap.request_quota_increase,
	MANAGE_ROLLOUTS: permissionsMap.rollout,
	MANAGE_BILLING: permissionsMap.read_billing,
};

export const roles = {
	viewer: BROAD_PERMISSIONS_MAP.READ_ONLY,
	editor:
		BROAD_PERMISSIONS_MAP.MANAGE_CHANNELS |
		BROAD_PERMISSIONS_MAP.MANAGE_DEPLOYMENTS |
		BROAD_PERMISSIONS_MAP.MANAGE_PIPE |
		BROAD_PERMISSIONS_MAP.MANAGE_SECRETS |
		BROAD_PERMISSIONS_MAP.MANAGE_REGISTRY |
		BROAD_PERMISSIONS_MAP.READ_ONLY,
	admin:
		BROAD_PERMISSIONS_MAP.MANAGE_CHANNELS |
		BROAD_PERMISSIONS_MAP.MANAGE_DEPLOYMENTS |
		BROAD_PERMISSIONS_MAP.MANAGE_MEMBERS |
		BROAD_PERMISSIONS_MAP.MANAGE_PIPE |
		BROAD_PERMISSIONS_MAP.MANAGE_PROJECT_TOKENS |
		BROAD_PERMISSIONS_MAP.MANAGE_SECRETS |
		BROAD_PERMISSIONS_MAP.MANAGE_REGISTRY |
		BROAD_PERMISSIONS_MAP.MANAGE_QUOTAS |
		BROAD_PERMISSIONS_MAP.READ_ONLY,
	owner:
		BROAD_PERMISSIONS_MAP.MANAGE_CHANNELS |
		BROAD_PERMISSIONS_MAP.MANAGE_DEPLOYMENTS |
		BROAD_PERMISSIONS_MAP.MANAGE_MEMBERS |
		BROAD_PERMISSIONS_MAP.MANAGE_PIPE |
		BROAD_PERMISSIONS_MAP.MANAGE_PROJECT_TOKENS |
		BROAD_PERMISSIONS_MAP.MANAGE_SECRETS |
		BROAD_PERMISSIONS_MAP.MANAGE_REGISTRY |
		BROAD_PERMISSIONS_MAP.MANAGE_QUOTAS |
		BROAD_PERMISSIONS_MAP.MANAGE_ROLLOUTS |
		BROAD_PERMISSIONS_MAP.MANAGE_BILLING,
};

export const permissions = {
	add(value: bigint, flag: bigint) {
		return BigInt(value) | flag;
	},

	test(value: bigint, flag: bigint) {
		return (BigInt(value) & flag) === flag;
	},

	subtract(value: bigint, flag: bigint) {
		return BigInt(value) & ~flag;
	},
};
