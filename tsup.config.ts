import {stripIndent} from 'common-tags';
import {defineConfig} from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	splitting: true,
	clean: true,
	minifySyntax: true,
	minifyWhitespace: true,
	sourcemap: 'inline',
	dts: true,
	format: ['cjs', 'esm'],
	target: 'node14',
	define: {
		TSUP_DEBUG: 'false',
	},
	banner: {
		js: stripIndent`
			/*
			 * Copyright ${new Date().getFullYear()} Hop, Inc
			 */
		`,
	},
});
