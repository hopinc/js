import {copyFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const dist = join(fileURLToPath(import.meta.url), '..', '..', 'dist');

const utils = readdirSync(join(dist, 'utils'));

const copy = (from, to) => {
	copyFileSync(join(dist, from), join(dist, to));
};

copy('index.d.ts', 'index.d.cts');

for (const util of utils) {
	copy(`utils/${util}/index.d.ts`, `utils/${util}/index.d.cts`);
}

copy('node/index.d.ts', 'node/index.d.cts');
