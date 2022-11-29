import {Empty} from '../../util/types.js';
import {Endpoint} from '../endpoints.js';

export type RegistryEndpoints =
	| Endpoint<'DELETE', '/v1/registry/images/:image', Empty>
	| Endpoint<'GET', '/v1/registry/images', {images: string[]}>
	| Endpoint<
			'GET',
			'/v1/registry/images/:image/manifests',
			{
				manifests: {
					digest: {
						digest: string;
						size: number;
						uploaded: string;
					};
					tag: string | null;
				}[];
			}
	  >;
