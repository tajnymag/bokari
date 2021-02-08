module.exports = {
	useTabs: true,
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'none',
	tabWidth: 4,
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
