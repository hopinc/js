import {defineConfig} from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	splitting: true,
	clean: true,
	minifySyntax: true,
	minifyWhitespace: true,
	sourcemap: true,
	dts: true,
});
