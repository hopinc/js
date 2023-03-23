# typed-channels

Typed channels is a small experiment that will (probably) ship eventually. It's a small wrapper to make it easier to work with channels and TypeScript. You can share a single object of all possible events between your backend and client, so that you'll get compile-time errors if you try to send an event that doesn't exist .

> **Note**
> Types can be defined in two ways here. Either with Zod schemas, or with TypeScript types. The Zod schemas are recommended, as you'll still have compile time safety, but you'll also get runtime validation. If you're using TypeScript types, you'll only get compile-time safety.

## Example

```ts
// Create or import your Hop instance
const hop = new Hop(auth);

// With types...
const client = typedChannelsClient.create(
	hop,
	typedChannelsClient.state<{name: string}>(),
	typedChannelsClient.events<{
        CREATE_MESSAGE: {
            id: string;
            content: string;
        }
    }>(),
);


// Or, with Zod Schemas (recommended)
const client = typedChannelsClient.create(
	hop,
	typedChannelsClient.state(
        z.object({
            name: z.string()
        })
    ),
	typedChannelsClient.events({
		CREATE_MESSAGE: z.object({
            id: z.string()
			content: z.string(),
		}),
	}),
);

await messages.publish('CREATE_MESSAGE', {
	id: Math.random().toString(36).substr(2, 9),
	content: 'Hello World',
});

// This will throw a compile-time error
await messages.publish('INVALID_EVENT', {
	epic: 'fail',
});
```
