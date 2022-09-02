import ts from 'typescript';
import {createReadStream} from 'node:fs';
import {json} from 'node:stream/consumers';

const tsconfig = (await json(createReadStream('./tsconfig.json'))) as {
	compilerOptions: ts.CompilerOptions;
};

const program = ts.createProgram(['./src/index.ts'], {
	...ts.getDefaultCompilerOptions(),
	...tsconfig.compilerOptions,
	moduleResolution: ts.ModuleResolutionKind.NodeNext,
	module: ts.ModuleKind.NodeNext,
});

const printer = ts.createPrinter();
const hop = program.getSourceFile('./src/hop.ts');

if (!hop) {
	throw new Error('Could not find Hop class file!');
}

const node = hop.forEachChild(node => {
	if (ts.isClassDeclaration(node)) {
		return node;
	}
});

if (!node) {
	throw new Error('Could not find Hop class!');
}

const members = node.members.filter(ts.isPropertyDeclaration);

const identifiers = members
	.map(member => member.name)
	.filter(Boolean)
	.filter(ts.isIdentifier);

for (const identifier of identifiers) {
	console.log(printer.printNode(ts.EmitHint.IdentifierName, identifier, hop));
}
