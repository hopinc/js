const glob = require('glob');
const fs = require('fs');

const utils = glob.sync('./src/utils/*');

const pkg = JSON.stringify(
	{main: './index.js', module: './index.mjs', types: './index.d.ts'},
	null,
	4,
);

for (const util of utils) {
	fs.writeFileSync(
		`./dist/utils/${util.split('/').pop()}/package.json`,
		pkg,
		'utf-8',
	);
}
