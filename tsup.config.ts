import {defineConfig, type Options} from 'tsup';

const commonBuild: Options = {
	splitting: true,
	clean: true,
	sourcemap: true,
	dts: true,
	format: ['cjs', 'esm'],
	minifySyntax: true,
	minifyWhitespace: true,
	target: 'esnext',
	banner: {
		js: `/* Copyright ${new Date().getFullYear()} Hop, Inc */`,
	},
};

const define = ({node = false} = {}) => ({
	TSUP_IS_NODE: JSON.stringify(node),
});

export default defineConfig([
	{
		...commonBuild,
		entry: ['src/index.ts', 'src/utils/*/index.ts'],
		define: define(),
	},
	{
		...commonBuild,
		entry: ['src/index.ts'],
		outDir: 'dist/node',
		define: define({
			node: true,
		}),
	},
]);
