import {defineConfig} from 'tsup';

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
	onSuccess: 'node postbuild.js',
	banner: {
		js: `/* Copyright ${new Date().getFullYear()} Hop, Inc */`,
	},
});
