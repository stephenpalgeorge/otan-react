#!/usr/bin/env node

const generateComponent = require('./lib/generate-component')
const setupLibrary = require('./lib/setup-library')

let args = process.argv.splice(2)

switch(args[0]) {
    case "setup":
        setupLibrary()
        break
    case "new":
        generateComponent()
        break
    default:
        setupLibrary()
}

module.exports = {
    setupLibrary, generateComponent
}