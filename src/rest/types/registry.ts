import {Endpoint} from '../endpoints';

export type RegistryEndpoints = Endpoint<
	'GET',
	'/v1/registry/projects/@this/images',
	{}
>;
