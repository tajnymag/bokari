module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	env: {
		node: true,
		browser: true
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
		"plugin:import/typescript"
	],
	plugins: [
		"prettier", "@typescript-eslint", "import"
	],
	rules: {
		"prettier/prettier": "error",
		"@typescript-eslint/member-ordering": "error",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/explicit-function-return-type": ["error", {
			"allowExpressions": true
		}],
		"@typescript-eslint/no-empty-function": ["error", {
			"allow": ["arrowFunctions"]
		}],
		"import/order": "error"
	}
}
