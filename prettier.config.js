module.exports = {
	useTabs: true,
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'none',
	tabWidth: 4,
	htmlWhitespaceSensitivity: 'ignore',
	overrides: [
		{
			files: '*.json',
			options: {
				singleQuote: false,
				useTabs: false,
				tabWidth: 2
			}
		}
	]
};
