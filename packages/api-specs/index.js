const path = require('path');

exports.getOpenAPI3SpecPath = () => path.join(__dirname, 'openapi3', `bokari.openapi3.json`);

exports.getOpenAPI3SpecDocument = () => require(exports.getOpenAPI3SpecPath());
