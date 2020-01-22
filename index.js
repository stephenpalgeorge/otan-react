#!/usr/bin/env node

const chalk = require('chalk')
const figlet = require('figlet')
const clear = require('clear')

const pkg = require('./package.json')

const deleteComponent = require('./lib/delete-component')
const generateComponent = require('./lib/generate-component')
const setupLibrary = require('./lib/setup-library')
const { hasArg } = require('./lib/utils')

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
    file structure in the directory you run the command from, you can pass 
    a name for your library with --name someName.

    ${chalk.green('loris-react new')}: generates a new a functional react
    component and handles all the import/export statements for you
        `
    )
}

let args = process.argv.splice(2)

switch(args[0]) {
    case "setup":
      let { index, value } = hasArg("name", args)
      if (index >= 0) setupLibrary(value)
      else setupLibrary()
      break
    case "new":
      generateComponent()
      break
    case "delete":
      deleteComponent()
      break
    case "-v":
    case "--version":
      console.log(chalk.yellow(`version: ${pkg.version}`))
      break
    default:
      showIntro()
}

module.exports = {
  generateComponent,
  setupLibrary,
  showIntro
}