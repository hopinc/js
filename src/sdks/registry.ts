import {Id} from '../rest';
import {BaseSDK} from './base-sdk';

export class Registry extends BaseSDK {
	async getImages(projectId?: Id<'project'>) {
		if (!projectId && this.client.authType !== 'sk') {
			throw new Error('projectId is required when using a PAT or bearer');
		}

		if (projectId) {
			const {images} = await this.client.get(
				'/v1/registry/:project_id/images',
				{project_id: projectId},
			);

			return {images};
		}

		const {images} = await this.client.get('/v1/registry/@this/images', {});
		return {images};
	}
}
