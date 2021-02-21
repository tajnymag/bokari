/* eslint-env node */
module.exports = {
	root: true,
  env: {
    es6: true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
	  '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'import/order': ['error', {
	    'alphabetize': {
	      order: 'asc'
      },
	    'newlines-between': 'always'
    }]
  },
  settings: {
    'import/resolver': {
	    typescript: {
	      project: 'packages/*/tsconfig.json'
      }
    }
  }
};
