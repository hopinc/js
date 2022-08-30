import {Id} from '../util/types.js';
import {sdk} from './create.js';

export const users = sdk(client => ({
	me: {
		/**
		 * Gets the current user
		 *
		 * @returns The current user authorized by the SDK
		 */
		async get() {
			if (client.authType === 'ptk') {
				throw new Error(
					'You cannot resolve a user from a project token! You must use a Bearer or PAT.',
				);
			}

			const me = await client.get('/v1/users/@me', {});

			return me;
		},

		pats: {
			/**
			 * Creates a PAT for the current user
			 *
			 * @returns The created PAT
			 */
			async create(name: string) {
				if (client.authType === 'ptk') {
					throw new Error(
						'You cannot create a PAT from a project token! You must use a Bearer or PAT.',
					);
				}

				const {pat} = await client.post('/v1/users/@me/pats', {name}, {});

				return pat;
			},

			/**
			 * Fetches all PATs for this user
			 *
			 * @returns A list of all pats
			 */
			async getAll() {
				if (client.authType === 'ptk') {
					throw new Error(
						'You cannot get all PATs from a project token! You must use a Bearer or PAT.',
					);
				}

				const {pats} = await client.get('/v1/users/@me/pats', {});

				return pats;
			},

			/**
			 * Deletes a pat
			 *
			 * @param id The ID of the pat to delete
			 */
			async delete(id: Id<'pat'>) {
				if (client.authType === 'ptk') {
					throw new Error(
						'You cannot delete a PAT from a project token! You must use a Bearer or PAT.',
					);
				}

				await client.delete(`/v1/users/@me/pats/:pat_id`, undefined, {
					pat_id: id,
				});
			},
		},
	},
}));
