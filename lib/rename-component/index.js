const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const fs = require('fs')

const { askSubDir, askTargetDir } = require('../common-inquirer')
const { askNewName } = require('./inquirer')
const {
  getPathToAtomicDir,
  getPathToLib,
  getShortPath,
  transformJSXName
} = require('../common-utils')
const {
  writeAtomicDirIndex,
  writeLibraryDataFile,
  writeLibraryIndex, 
  writeLibraryScssFile
} = require('../common-utils/files')
const { renameJSFile, renameSassFile } = require('./files')

clear()
console.log(figlet.textSync('Orangutan', {
  horizontalLayout: "default"
}))

const run = async (libName = "library") => {
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

  const currentComponentName = getShortPath(destination)
  const { newComponentName } = await askNewName()

  // rename files and directory
  renameJSFile(destination, currentComponentName, newComponentName, 'js')
  renameJSFile(destination, currentComponentName, newComponentName, 'test.js')
  renameSassFile(destination, currentComponentName, newComponentName)
  fs.renameSync(destination, `${getPathToAtomicDir(destination)}/${transformJSXName(newComponentName)}`)
  // rewrite library indexes
  const pathToLib = getPathToLib(destination, libName)
  writeAtomicDirIndex(getPathToAtomicDir(destination))
  writeLibraryDataFile(pathToLib)
  writeLibraryIndex(pathToLib)
  writeLibraryScssFile(pathToLib)
}

module.exports = run
