module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'eslint:recommended',
	],
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 2020
	}
};
