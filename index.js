#!/usr/bin/env node

const chalk = require('chalk')
const figlet = require('figlet')
const clear = require('clear')

const pkg = require('./package.json')

const deleteComponent = require('./lib/delete-component')
const generateComponent = require('./lib/generate-component')
const rebuildLibrary = require('./lib/rebuild-library')
const setupLibrary = require('./lib/setup-library')
const { hasArg } = require('./lib/utils')

const showIntro = () => {
    clear()
    console.log(figlet.textSync('Orangutan', {
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
    welcome to the otan-react CLI, here\'s a list 
    of available commands or you can find more information
    at https://github.com/stephenngeorge/otan-react#README.md

    ${chalk.green('otan-react setup')}: generates a new component library 
    file structure in the directory you run the command from, you can pass 
    a name for your library with --name someName.

    ${chalk.green('otan-react new')}: generates a new a functional react
    component and handles all the import/export statements for you.

    ${chalk.green('otan-react delete')}: deletes a component of your choosing
    and updates all of the import/export statements accordingly.

    ${chalk.green('otan-react rebuild')}: reads the library directory structure
    and reconstructs all of the import/export statements. This is useful if you've
    renamed a component and don't want to have to update all this manually, or if an
    export/import has been accidentally lost somewhere in the chain.
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
    case "rebuild":
      rebuildLibrary()
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