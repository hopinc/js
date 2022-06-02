import {Id} from '../rest';
import {BaseSDK} from './base-sdk';

export class Projects extends BaseSDK {
	/**
	 * Deletes a secret key by its ID
	 *
	 * @param secretKeyId The ID of the secret key to delete
	 */
	async deleteSecretKey(secretKeyId: Id<'skid'>) {
		await this.client.delete(
			'/v1/projects/secret-keys/:secret_key',
			undefined,
			{secret_key: secretKeyId},
		);
	}

	/**
	 * Get all secret keys for a project
	 *
	 * @param projectId The project to fetch secrets for
	 * @returns An array of all secrets for the project
	 */
	async getSecretKeys(projectId?: Id<'project'>) {
		if (this.client.authType !== 'sk' && !projectId) {
			throw new Error('Project ID is required for bearer or PAT authorization');
		}

		if (!projectId) {
			const {secret_keys: keys} = await this.client.get(
				'/v1/projects/@this/secret-keys',
				{},
			);

			return keys;
		}

		const {secret_keys: keys} = await this.client.get(
			'/v1/projects/:project_id/secret-keys',
			{project_id: projectId},
		);

		return keys;
	}

	/**
	 * Fetch the currently authorized member from a project.
	 * You cannot use this route if you are authorizing with a secret key as there is no user attached to it.
	 *
	 * @param projectId The project ID to fetch a member from
	 * @returns The member authorized by the SDK
	 */
	async getCurrentMember(projectId: Id<'project'>) {
		if (this.client.authType === 'sk') {
			throw new Error(
				'You cannot resolve a member from a secret key! You must use a bearer or pat token',
			);
		}

		const {project_member: member} = await this.client.get(
			'/v1/projects/:project_id/members/@me',
			{project_id: projectId},
		);

		return member;
	}

	async getAllMembers(projectId?: Id<'project'>) {
		if (this.client.authType !== 'sk' && !projectId) {
			throw new Error(
				'Project ID is required for bearer or PAT authorization to fetch all project members',
			);
		}

		if (projectId) {
			const {members} = await this.client.get(
				'/v1/projects/:project_id/members',
				{
					project_id: projectId,
				},
			);

			return members;
		}

		const {members} = await this.client.get('/v1/projects/@this/members', {});

		return members;
	}
}
