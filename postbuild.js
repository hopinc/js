const glob = require('glob');
const fs = require('fs');

const utils = glob.sync('./src/utils/*');

/**
 * Generate a package.json file for a util
 *
 * @param {string} utilName The name of the util to be exported
 * @returns A package.json config
 */
const pkg = utilName =>
	JSON.stringify(
		{
			main: `../../dist/utils/${utilName}/index.js`,
			module: `../../dist/utils/${utilName}/index.mjs`,
			types: `../../dist/utils/${utilName}/index.d.ts`,
		},
		null,
		4,
	);

if (!fs.existsSync('./utils')) {
	fs.mkdirSync('./utils');
}

for (const util of utils) {
	const utilName = util.split('/').pop();

	const directory = `./utils/${utilName}`;

	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory);
	}

	fs.writeFileSync(`${directory}/package.json`, pkg(utilName), 'utf-8');
}
