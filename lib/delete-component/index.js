const clear = require("clear")
const chalk = require("chalk")
const figlet = require("figlet")

const { getPathToAtomicDir, getPathToLib, getShortPath } = require('../common-utils')
const { askSubDir, askTargetDir } = require("../common-inquirer")
const { confirmDelete } = require("./inquirer")
const {
  writeAtomicDirIndex,
  writeLibraryIndex,
  writeLibraryScssFile,
  writeLibraryDataFile
} = require('../common-utils/files')
const { deleteDir } = require('./utils')

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
  /**
   * GET USER INPUT
   */
  // get component directory that is to be deleted
  const { targetDir } = await askTargetDir(process.cwd(), "navigate to the component you want to remove")
  
  // exit function if no component is selected
  const componentDir = await drillSubdirs(targetDir)
  const pathToLib = getPathToLib(componentDir, libName)
  const pathToAtomicDir = getPathToAtomicDir(componentDir)

  // make user confirm delete
  console.log(chalk.red(`About to delete component: ${componentDir}`))

  const { confirmDelete: deleteComponent } = await confirmDelete(getShortPath(componentDir))
  
  // if they do not want to delete the component, give a confirmation
  // message and then exit the function
  if (!deleteComponent) {
    console.log(chalk.yellow(`ok, nothing will be deleted...phew!`))
    return
  }
  // if they do want to delete the component, continue
  else {
    deleteDir(componentDir)
    writeAtomicDirIndex(pathToAtomicDir)
    writeLibraryIndex(pathToLib)
    writeLibraryScssFile(pathToLib)
    writeLibraryDataFile(pathToLib)

    console.log("we've also removed all of the imports/exports for this component.")
  }
}

module.exports = run