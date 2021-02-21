/* eslint-env node */
const path = require('path');

module.exports = {
	root: false,
	extends: [
		'../../.eslintrc.js',
		'plugin:vue/recommended',
		'@vue/typescript/recommended',
		'@vue/prettier',
		'@vue/prettier/@typescript-eslint'
	],
	env: {
		es6: true,
		browser: true
	},
	parserOptions: {
		parser: '@typescript-eslint/parser'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'vue/static-class-names-order': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-unused-vars': 'off'
	}
};
