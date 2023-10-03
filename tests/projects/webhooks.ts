import {Hop, validateId, type Webhook} from '../../src';
import assert from 'node:assert/strict';
import {test} from 'node:test';

export function webhookTests(hop: Hop) {
	let createdWebhook: Webhook;

	test('It creates a webhook', async () => {
		const webhook = await hop.projects.webhooks.create(
			'https://example.com/webhook',
			['ignite.deployment.build.cancelled', 'channel.client.disconnected'],
		);

		assert.ok(
			validateId(webhook.id, 'webhook'),
			"Couldn't validate webhook ID",
		);
		assert.ok(
			validateId(webhook.project_id, 'project'),
			"Couldn't validate project ID",
		);
		assert.equal(webhook.type, 'http');
		assert.equal(webhook.webhook_url, 'https://example.com/webhook');
		assert.equal(webhook.events.length, 2);
		assert.equal(webhook.secret.includes('*'), false);

		createdWebhook = webhook;
	});

	test('It gets all webhooks', async () => {
		const webhooks = await hop.projects.webhooks.getAll();

		assert.ok(Array.isArray(webhooks));
		assert.ok(webhooks.length > 0);
		assert.ok(webhooks.some(webhook => webhook.id === createdWebhook.id));
		assert.ok(webhooks.every(webhook => webhook.secret.includes('*')));
	});

	test('It can edit a webhook', async () => {
		const webhook = await hop.projects.webhooks.edit(createdWebhook.id, {
			events: ['ignite.deployment.build.started'],
		});

		assert.ok(webhook.events.includes('ignite.deployment.build.started'));
		assert.ok(!webhook.events.includes('ignite.deployment.build.cancelled'));
	});

	test('It can regenerate a webhook secret', async () => {
		const secret = await hop.projects.webhooks.regenerateSecret(
			createdWebhook.id,
		);

		assert.ok(!secret.includes('*'));
		assert.ok(secret.length > 10);
		assert.ok(secret !== createdWebhook.secret);
	});

	test('It can delete a webhook', async () => {
		await hop.projects.webhooks.delete(createdWebhook.id);

		const webhooks = await hop.projects.webhooks.getAll();

		assert.ok(!webhooks.some(webhook => webhook.id === createdWebhook.id));
	});

	test('Can verify and construct event', async () => {
		// These are test values, basically made by the server but aren't actually a real instance (So secrets and signatures don't actually belong to anyone)
		const randomTestSignature =
			'86EBE7F54A92C809CDF8F3DC6536C566A1C074F9B001E9118DF7EC433BE435E7';
		const randomTestBody =
			'{"webhook_id":"webhook_MTkzMDU5MTE4NzcyNDA0MjI3","project_id":"project_MTY1MjU5NTk1NTAwNTY4NTc3","occurred_at":"2023-10-02T15:46:13.323Z","id":"event_MTkzMzkwODU2OTQwODkyMjgx","event":"ignite.deployment.container.metrics_update","data":{"metrics":{"memory_usage_percent":"0.07","memory_usage_bytes":393216,"cpu_usage_percent":"0.00"},"container_id":"container_MTkzMDc3MjExODczMDc5MzAx"}}';
		const randomTestSecret =
			'whsec_c18zMDkxNWRmYzUwOTM4YmFiOTkwZjc3NTYwYjhhOTNkNF8xOTMwNTkxMTg3NzI0MDQyMjg';

		const event = await hop.projects.webhooks.constructEvent(
			randomTestBody,
			randomTestSignature,
			randomTestSecret,
		);

		assert.ok(validateId(event.id, 'event'));
		assert.ok(validateId(event.webhook_id, 'webhook'));
		assert.ok(validateId(event.project_id, 'project'));
		assert.equal(event.event, 'ignite.deployment.container.metrics_update');

		try {
			await hop.projects.webhooks.constructEvent(
				randomTestBody,
				randomTestSignature,
				'wrong_secret',
			);

			assert.fail('Event succeeded with wrong secret');
		} catch {
			// pass :D
		}

		try {
			await hop.projects.webhooks.constructEvent(
				randomTestBody,
				'wrong_signature',
				randomTestSecret,
			);

			assert.fail('Event succeeded with wrong signature');
		} catch {
			// pass :D
		}

		try {
			await hop.projects.webhooks.constructEvent(
				'wrong_body',
				randomTestSignature,
				randomTestSecret,
			);

			assert.fail('Event succeeded with wrong body');
		} catch {
			// pass :D
		}
	});
}
