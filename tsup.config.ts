import {defineConfig} from 'tsup';

import glob from 'glob';
import fs from 'fs';

const utils = glob.sync('./src/utils/*');

/**
 * Generate a package.json file for a util
 *
 * @param {string} utilName The name of the util to be exported
 * @returns A package.json config
 */
function pkg(utilName: string) {
	return JSON.stringify(
		{
			main: `../../dist/utils/${utilName}/index.js`,
			module: `../../dist/utils/${utilName}/index.mjs`,
			types: `../../dist/utils/${utilName}/index.d.ts`,
		},
		null,
		4,
	);
}

export default defineConfig({
	entry: ['src/index.ts', 'src/utils/*/index.ts'],
	splitting: true,
	clean: true,
	minifySyntax: true,
	minifyWhitespace: true,
	sourcemap: true,
	dts: true,
	format: ['cjs', 'esm'],
	target: 'node14',
	define: {
		TSUP_DEBUG: 'false',
	},
	onSuccess: async () => {
		if (!fs.existsSync('./utils')) {
			fs.mkdirSync('./utils');
		}

		for (const util of utils) {
			const utilName = util.split('/').pop();

			if (!utilName) {
				continue;
			}

			const directory = `./utils/${utilName}`;

			if (!fs.existsSync(directory)) {
				fs.mkdirSync(directory);
			}

			fs.writeFileSync(`${directory}/package.json`, pkg(utilName), 'utf-8');
		}
	},
	banner: {
		js: `/* Copyright ${new Date().getFullYear()} Hop, Inc */`,
	},
});
