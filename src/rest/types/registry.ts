import {Endpoint} from '../endpoints';
import {Timestamp} from './types';

export interface Image {
	/**
	 * The name for this docker image
	 */
	name: string;

	/**
	 * An array of tags for this image
	 */
	tags: string[];

	/**
	 * The time this image was created
	 */
	created_at: Timestamp;
}

export type RegistryEndpoints =
	| Endpoint<'GET', '/v1/registry/@this/images', {images: Image[]}>
	| Endpoint<'GET', '/v1/registry/:project_id/images', {images: Image[]}>;
