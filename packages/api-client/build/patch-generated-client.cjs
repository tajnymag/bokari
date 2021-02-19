const fs = require('fs');
const path = require('path');

const EXPECTED_MODEL_FILES = 4;
const MODEL_FILE_USAGE_REGEX = /<any>/g;

const EXPECTED_CURRENCY_ENUMS = 1;
const CURRENCY_ENUM_DECLARATION_REGEX = /\/\*\*\n(?:.+\n)*export enum Currency {\s*(?:.+\n)*/gm;

const EXPECTED_PERMISSION_ENUMS = 3;
const PERMISSION_ENUM_DECLARATION_REGEX = /\/\*\*\n(?:.+\n)*export enum Permissions {\s*(?:.+\n)*/gm;

const EXPECTED_TYPE_ENUMS = 3;
const TYPE_ENUM_DECLARATION_REGEX = /\/\*\*\n(?:.+\n)*export enum Type {\s*(?:.+\n)*/gm;

const fileToPatch = path.join(__dirname, '..', 'src', 'api.ts');

console.log(`Loading file ${fileToPatch}`);
const originalFileContents = fs.readFileSync(fileToPatch, {
	encoding: 'utf-8'
});
let patchedFileContents = originalFileContents;

console.log('Patching ModelFile...');
if (patchedFileContents.match(MODEL_FILE_USAGE_REGEX).length === EXPECTED_MODEL_FILES) {
	patchedFileContents = patchedFileContents.replace(MODEL_FILE_USAGE_REGEX, '<ModelFile>');
} else {
	console.error('Found an unexpected number of ModelFiles to be patched. Check the original file!');
	process.exit(1);
}

console.log('Patching Permissions...');
if (patchedFileContents.match(PERMISSION_ENUM_DECLARATION_REGEX).length === EXPECTED_PERMISSION_ENUMS) {
	patchedFileContents = patchedFileContents.replace(PERMISSION_ENUM_DECLARATION_REGEX, '');
	patchedFileContents = 'import { Permission as Permissions } from "@bokari/entities"\n' + patchedFileContents;
} else {
	console.error('Found an unexpected number of Permissions to be patched. Check the original file!');
	process.exit(1);
}

console.log('Patching Currency...');
if (patchedFileContents.match(CURRENCY_ENUM_DECLARATION_REGEX).length === EXPECTED_CURRENCY_ENUMS) {
	patchedFileContents = patchedFileContents.replace(CURRENCY_ENUM_DECLARATION_REGEX, '');
	patchedFileContents = 'import { Currency } from "@bokari/entities"\n' + patchedFileContents;
} else {
	console.error('Found an unexpected number of Currency to be patched. Check the original file!');
	process.exit(1);
}

console.log('Patching Type...');
if (patchedFileContents.match(TYPE_ENUM_DECLARATION_REGEX).length === EXPECTED_TYPE_ENUMS) {
	while (patchedFileContents.match(TYPE_ENUM_DECLARATION_REGEX).length > 1) {
		patchedFileContents = patchedFileContents.replace(new RegExp(TYPE_ENUM_DECLARATION_REGEX.source, TYPE_ENUM_DECLARATION_REGEX.flags.replace('g', '')), '');
	}
} else {
	console.error('Found an unexpected number of Type to be patched. Check the original file!');
	process.exit(1);
}

console.log('Saving changes to the original file...');
fs.writeFileSync(fileToPatch, patchedFileContents, { encoding: 'utf-8' });

console.log(`File ${fileToPatch} has been successfully patched`);
