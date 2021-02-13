const fs = require('fs');
const path = require('path');

console.log('Deleting the dist/ directory...');
fs.rmSync(path.join(__dirname, '..', 'dist'), { recursive: true, force: true });

console.log('The dist/ directory has been successfully deleted.')
