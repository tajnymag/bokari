import * as fs from 'fs';
import * as path from 'path';

import flatten from 'flat';

import * as locales from '../src/locales';

const localePrefixes = process.argv[2].replace(/\s+/g, '').split(',') || [];
const messageKeys = new Set();
const outputPath = path.join(__dirname, '../src/locales/types', 'index.ts');

console.log('Preparing types...');
for (const localePrefix of localePrefixes) {
	const localeKey = `${localePrefix}Locale`;
	const locale = locales[localeKey as keyof typeof locales];

	if (locale && locale.messages) {
		const localeMessageKeys: string[] = Object.keys(flatten(locale.messages));

		localeMessageKeys.forEach(localeMessageKey => messageKeys.add(localeMessageKey));
	}
}

const outputContent = `
export type TypedLocaleMessagePath = ${Array.from(messageKeys)
	.map(messageKey => JSON.stringify(messageKey))
	.join(' | ')};
export type TypedLocale = ${localePrefixes
	.map(localePrefix => JSON.stringify(localePrefix))
	.join(' | ')};
`;

console.log('Writing files...');
fs.writeFileSync(outputPath, outputContent.trim(), { encoding: 'utf8' });

console.log(`Types written successfully to ${outputPath}`);
