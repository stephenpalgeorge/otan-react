#!/usr/bin/env node

const chalk = require('chalk')
const figlet = require('figlet')
const clear = require('clear')

const pkg = require('./package.json')

const generateComponent = require('./lib/generate-component')
const setupLibrary = require('./lib/setup-library')

const showIntro = () => {
    clear()
    console.log(figlet.textSync('Loris React', {
        horizontalLayout: "default"
    }))

    console.log(`
      ${chalk.bgYellow(`
    version: ${pkg.version}`)}
      ${chalk.yellow(`
    ${pkg.description}`)}
    `)

    console.log(
        `
    welcome to the loris-react CLI, here\'s a list 
    of available commands or you can find more information
    at https://github.com/stephenngeorge/loris-react#README.md

    ${chalk.green('loris-react setup')}: generates a new component library 
    file structure in the directory you run the command from

    ${chalk.green('loris-react new')}: generates a new a functional react
    component and handles all the import/export statements for you
        `
    )
}

let args = process.argv.splice(2)

switch(args[0]) {
    case "setup":
      setupLibrary()
      break
    case "new":
      generateComponent()
      break
    case "-v":
    case "--version":
      console.log(chalk.yellow(`version: ${pkg.version}`))
      break
    default:
      showIntro()
}

module.exports = {
    setupLibrary, generateComponent
}