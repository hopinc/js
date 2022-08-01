import {Id} from '../rest';
import {BaseSDK} from './base-sdk';

export class Registry extends BaseSDK {
	async getImages(projectId?: Id<'project'>) {
		if (!projectId && this.client.authType !== 'ptk') {
			throw new Error('projectId is required when using a PAT or bearer');
		}

		if (projectId) {
			const {images} = await this.client.get('/v1/registry/images', {
				project: projectId,
			});

			return {images};
		}
	}

	async getImageManifest(image: string) {
		const {manifests} = await this.client.get(
			'/v1/registry/images/:image/manifests',
			{image},
		);

		return manifests;
	}

	async deleteImage(image: string) {
		await this.client.delete('/v1/registry/images/:image', undefined, {image});
	}
}
