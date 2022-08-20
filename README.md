# @onehop/js

Hop's JavaScript library. Requires Node.js 12+

## Usage

Create a [project token](https://docs.hop.io/reference/project_tokens) or personal access token.

```ts
import {Hop} from '@onehop/js';

const myToken = 'ptk_xxx';
const hop = new Hop(myToken);

// Example: Creating a project secret
hop.projects.secrets.create(
	'RANDOM_NUMBER',
	Math.floor(Math.random() * 100).toString(),
);
```
