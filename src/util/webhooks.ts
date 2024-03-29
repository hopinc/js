import type {Event} from '..';
import {crypto} from './crypto';

export const POSSIBLE_EVENTS = {
	// These are not yet implemented
	/* 	Channels: [
		{
			id: 'channel.created',
			name: 'Created',
		},
		{
			id: 'channel.updated',
			name: 'Updated',
		},
		{
			id: 'channel.deleted',
			name: 'Deleted',
		},
		{
			id: 'channel.client.connected',
			name: 'Client Connected',
		},
		{
			id: 'channel.client.disconnected',
			name: 'Client Disconnected',
		},
	], */
	Ignite: [
		{
			id: 'ignite.deployment.created',
			name: 'Deployment Created',
		},
		{
			id: 'ignite.deployment.updated',
			name: 'Deployment Updated',
		},
		{
			id: 'ignite.deployment.deleted',
			name: 'Deployment Deleted',
		},
		{
			id: 'ignite.deployment.build.created',
			name: 'Build Created',
		},
		{
			id: 'ignite.deployment.build.started',
			name: 'Build Started',
		},
		{
			id: 'ignite.deployment.build.updated',
			name: 'Build Updated',
		},
		{
			id: 'ignite.deployment.build.completed',
			name: 'Build Completed',
		},
		{
			id: 'ignite.deployment.build.failed',
			name: 'Build Failed',
		},
		{
			id: 'ignite.deployment.build.cancelled',
			name: 'Build Cancelled',
		},
		{
			id: 'ignite.deployment.rollout.created',
			name: 'Rollout Created',
		},
		{
			id: 'ignite.deployment.rollout.updated',
			name: 'Rollout Updated',
		},
		{
			id: 'ignite.deployment.container.created',
			name: 'Container Created',
		},
		{
			id: 'ignite.deployment.container.updated',
			name: 'Container Updated',
		},
		{
			id: 'ignite.deployment.container.metrics_update',
			name: 'Container Metrics Update',
		},
		{
			id: 'ignite.deployment.container.deleted',
			name: 'Container Deleted',
		},
		{
			id: 'ignite.deployment.healthcheck.created',
			name: 'Healthcheck Created',
		},
		{
			id: 'ignite.deployment.healthcheck.updated',
			name: 'Healthcheck Updated',
		},
		{
			id: 'ignite.deployment.healthcheck.deleted',
			name: 'Healthcheck Deleted',
		},
		{
			id: 'ignite.deployment.healthcheck.events.failed',
			name: 'Healthcheck Events Failed',
		},
		{
			id: 'ignite.deployment.healthcheck.events.succeeded',
			name: 'Healthcheck Events Succeeded',
		},
		{
			id: 'ignite.deployment.gateway.created',
			name: 'Gateway Created',
		},
		{
			id: 'ignite.deployment.gateway.updated',
			name: 'Gateway Updated',
		},
		{
			id: 'ignite.deployment.gateway.deleted',
			name: 'Gateway Deleted',
		},
	],
	Project: [
		{
			id: 'project.updated',
			name: 'Updated',
		},
		{
			id: 'project.member.created',
			name: 'Member Created',
		},
		{
			id: 'project.member.updated',
			name: 'Member Updated',
		},
		{
			id: 'project.member.deleted',
			name: 'Member Deleted',
		},
		{
			id: 'project.tokens.created',
			name: 'Token Created',
		},
		{
			id: 'project.tokens.deleted',
			name: 'Token Deleted',
		},
		{
			id: 'project.secrets.created',
			name: 'Secret Created',
		},
		{
			id: 'project.secrets.updated',
			name: 'Secret Updated',
		},
		{
			id: 'project.secrets.deleted',
			name: 'Secret Deleted',
		},
		{
			id: 'project.finance.transaction',
			name: 'Finance Transaction',
		},
	],
} as const;

// Todo: maybe add type-fest/readonly-deep to keep the as const but also keep a structure type

/**
 * Utility function to verify hmac signatures
 *
 * @param body The stringed body received from the request
 * @param signature The signature from the X-Hop-Hooks-Signature
 * @param secret The secret provided upon webhook creation to verify the signature. (e.x: whsec_xxxxx)
 */
export async function verifyHmac(
	body: string,
	signature: string,
	secret: string,
) {
	const encoder = new TextEncoder();
	const encodedBody = encoder.encode(body);

	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{name: 'HMAC', hash: 'SHA-256'},
		false,
		['sign'],
	);

	const signatureBuffer = await crypto.subtle.sign('HMAC', key, encodedBody);

	const finalSig = Array.from(new Uint8Array(signatureBuffer))
		.map(byte => byte.toString(16).padStart(2, '0'))
		.join('');

	return signature.toLowerCase() === finalSig;
}

/**
 * Utility function that returns a type-safe webhook event, throws if signature is invalid.
 *
 * @param body The stringed body received from the request
 * @param signature The signature from the X-Hop-Hooks-Signature
 * @param secret The secret provided upon webhook creation to verify the signature. (e.x: whsec_xxxxx)
 */
export async function constructEvent(
	body: string,
	signature: string,
	secret: string,
) {
	const hmacVerified = await verifyHmac(body, signature, secret);
	if (!hmacVerified) {
		throw new Error('Invalid signature');
	}

	const event = JSON.parse(body) as Event;
	return event;
}
