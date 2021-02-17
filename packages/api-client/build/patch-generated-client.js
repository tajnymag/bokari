const fs = require('fs');
const path = require('path');

const fileToPatch = path.join(__dirname, '..', 'src', 'api.ts');
const expectedNumberOfFields = 4;

console.log(`Loading file ${fileToPatch}`)
const originalFileContents = fs.readFileSync(fileToPatch, {
	encoding: 'utf-8'
});

console.log('Patching...');
if (originalFileContents.match(/<any>/g).length !== expectedNumberOfFields) {
	console.error('Found an unexpected number of fields to be patched. Check the original file!')
	process.exit(1);
}

const patchedFileContents = originalFileContents.replace(/<any>/g, '<ModelFile>');
fs.writeFileSync(fileToPatch, patchedFileContents, { encoding: 'utf-8' });

console.log(`File ${fileToPatch} has been successfully patched`)
