import {Id} from '../rest';
import {BaseSDK} from './base-sdk';

export class Projects extends BaseSDK {
	/**
	 * Deletes a project token by its ID
	 *
	 * @param projectTokenId The ID of the project token to delete
	 */
	async deleteProjectToken(
		projectTokenId: Id<'ptkid'>,
		project?: Id<'project'>,
	) {
		if (this.client.authType !== 'ptk' && !project) {
			throw new Error(
				'Project ID is required for bearer or PAT authorization to delete a project token',
			);
		}

		await this.client.delete(
			project
				? '/v1/projects/:project_id/tokens/:project_token_id'
				: '/v1/projects/@this/tokens/:project_token_id',
			undefined,
			project
				? {
						project_token_id: projectTokenId,
						project_id: project,
				  }
				: {
						project_token_id: projectTokenId,
				  },
		);
	}

	/**
	 * Creates a new project token
	 *
	 * @param projectId The project to create a key for
	 * @param flags Permissions for this flag
	 * @returns A newly created project token
	 */
	async createProjectToken(projectId: Id<'project'>, flags: number) {
		const {project_token: key} = await this.client.post(
			'/v1/projects/:project_id/tokens',
			{flags},
			{project_id: projectId},
		);

		return key;
	}

	/**
	 * Get all project tokens for a project
	 *
	 * @param projectId The project to fetch secrets for
	 * @returns An array of all secrets for the project
	 */
	async getProjectTokens(projectId?: Id<'project'>) {
		if (this.client.authType !== 'ptk' && !projectId) {
			throw new Error('Project ID is required for bearer or PAT authorization');
		}

		if (!projectId) {
			const {project_tokens: keys} = await this.client.get(
				'/v1/projects/@this/tokens',
				{},
			);

			return keys;
		}

		const {project_tokens: keys} = await this.client.get(
			'/v1/projects/:project_id/tokens',
			{project_id: projectId},
		);

		return keys;
	}

	/**
	 * Fetch the currently authorized member from a project.
	 * You cannot use this route if you are authorizing with a project token as there is no user attached to it.
	 *
	 * @param projectId The project ID to fetch a member from
	 * @returns The member authorized by the SDK
	 */
	async getCurrentMember(projectId: Id<'project'>) {
		if (this.client.authType === 'ptk') {
			throw new Error(
				'You cannot resolve a member from a project token! You must use a bearer or pat token',
			);
		}

		const {project_member: member} = await this.client.get(
			'/v1/projects/:project_id/members/@me',
			{project_id: projectId},
		);

		return member;
	}

	async getAllMembers(projectId?: Id<'project'>) {
		if (this.client.authType !== 'ptk' && !projectId) {
			throw new Error(
				'Project ID is required for bearer or PAT authorization to fetch all project members',
			);
		}

		if (projectId) {
			const {members} = await this.client.get(
				'/v1/projects/:project_id/members',
				{project_id: projectId},
			);

			return members;
		}

		const {members} = await this.client.get('/v1/projects/@this/members', {});

		return members;
	}
}
