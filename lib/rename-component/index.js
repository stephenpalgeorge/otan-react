const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const fs = require('fs')

const { askSubDir, askTargetDir } = require('../common-inquirer')
const { askNewName } = require('./inquirer')
const { getPathToAtomicDir } = require('../common-utils')

clear()
console.log(figlet.textSync('Orangutan', {
  horizontalLayout: "default"
}))

const run = async () => {
  /**
   * drillSubdirs reccursively asks the user for their choice
   * of directory and creates a final path, that represents that
   * entire location.
   * @param {String} currentDir = the starting point for each iteration
   * @param {Array} path = all of the pieces of the path accumulated
   */
  async function drillSubdirs(currentDir, path = []) {
    // append latest selection to the path array
    path.push(currentDir)
    // get the users selection of sub-directory
    const { subdir } = await askSubDir(path.join('/'))
    // if subdir is empty (this happens when a directory does not
    // contain any further directories) or root, return the filepath
    if (subdir === "" || subdir === './') return path.join('/')
    // otherwise, ask again...
    else return await drillSubdirs(subdir, path)
  }

  const { targetDir } = await askTargetDir(process.cwd(), "Select the component you want to rename:")
  const destination = await drillSubdirs(targetDir)

  const { newComponentName } = await askNewName()

  // rename directory
  fs.renameSync(destination, `${getPathToAtomicDir(destination)}/${newComponentName}`)
}

module.exports = run
