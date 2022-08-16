import {Id} from '../rest';
import {sdk} from './create';

export const registry = sdk(client => {
	return {
		images: {
			async getAll(projectId?: Id<'project'>) {
				if (!projectId && client.authType !== 'ptk') {
					throw new Error('projectId is required when using a PAT or bearer');
				}

				if (projectId) {
					const {images} = await client.get('/v1/registry/images', {
						project: projectId,
					});

					return {images};
				}
			},

			async getManifest(image: string) {
				const {manifests} = await client.get(
					'/v1/registry/images/:image/manifests',
					{image},
				);

				return manifests;
			},

			async delete(image: string) {
				await client.delete('/v1/registry/images/:image', undefined, {image});
			},
		},
	};
});
