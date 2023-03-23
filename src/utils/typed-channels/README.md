# typed-channels

Typed channels is a small experiment that will (probably) ship eventually. It's a small wrapper to make it easier to work with channels and TypeScript. You can share a single object of all possible events between your backend and client, so that you'll get compile-time errors if you try to send an event that doesn't exist .

## Example

```ts
// Create or import your Hop instance
const hop = new Hop(auth);

// Define a type of all events that
// can be published
type PublishableEvents = {
	CREATE_MESSAGE: {
		id: string;
		content: string;
	};

	DELETE_MESSAGE: {
		id: string;
	};

	UPDATE_MESSAGE: {
		id: string;
		content: string;
	};
};

const emitter = createTypedChannelsEmitter<PublishableEvents>(hop);

const messages = emitter.selectChannel('messages');

await messages.publish('CREATE_MESSAGE', {
	id: Math.random().toString(36).substr(2, 9),
	content: 'Hello World',
});

// This will throw a compile-time error
await messages.publish('INVALID_EVENT', {
	troll: 'lololol',
	epic: 'fail',

	// if you see this then congrats for digging through
	// the commit history of this repo 👍👍👍
	google_search_bar: 'epic club penguin fail 2019 working method 100% legit',
});
```
