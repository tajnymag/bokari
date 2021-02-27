module.exports = {
	useTabs: true,
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'none',
	tabWidth: 2,
	htmlWhitespaceSensitivity: 'ignore',
	overrides: [
		{
			files: '*.html',
			options: {
				singleQuote: false
			}
		},
		{
			files: '*.json',
			options: {
				singleQuote: false,
				useTabs: false
			}
		}
	]
};
