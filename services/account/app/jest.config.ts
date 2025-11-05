import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testPathIgnorePatterns: [
		"/node_modules/",
		"/dist/"
	],

	// --- I AM ADDING THIS BLOCK ---
	// Explicitly tell Jest what file types to look for
	// This helps the resolver work with moduleNameMapper
	moduleFileExtensions: [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json",
		"node"
	],
	// --- END OF NEW BLOCK ---

	// This tells Jest how to resolve your .js imports
	// It says "if you see an import like './app.js',
	// try to find './app.ts' or './app.tsx' instead."
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},

	// This tells ts-jest to transform your 'import'
	// statements into 'require' statements
	// *before* Jest tries to run the code.
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: {
					// This overrides your main tsconfig.json just for tests
					module: 'CommonJS',
				},
			},
		],
	},
};

export default jestConfig;

