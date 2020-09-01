module.exports = {
	useTabs: true,
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'none',
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
