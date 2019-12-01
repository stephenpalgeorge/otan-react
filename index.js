#!/usr/bin/env node

const generateComponent = require('./lib/generate-component')

let args = process.argv.splice(2)

if (args[0] == "setup") require('./lib/setup-library')

module.exports = {
    setupLibrary, generateComponent
}