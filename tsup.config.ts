import {stripIndent} from 'common-tags';
import {defineConfig} from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	splitting: true,
	clean: true,
	minifySyntax: true,
	minifyWhitespace: true,
	sourcemap: true,
	dts: true,
	format: ['cjs', 'esm'],
	banner: {
		js: stripIndent`

			/*
			 * Copyright ${new Date().getFullYear()} Hop, Inc
			 */
		`,
	},
});
