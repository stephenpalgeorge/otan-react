const clear = require('clear')
const figlet = require('figlet')
const chalk = require('chalk')
const fs = require('fs')
const util = require('util')

const mkdir = util.promisify(fs.mkdir)

const {
  askSubDir,
  askTargetDir
} = require('../common-inquirer')
const {
  askComponentName,
  askFilesInclude
} = require('./inquirer')

const {
  writeDataFile,
  writeJSFile,
  writeSassFile,
  writeTestFile
} = require('./files')

const {
  transformJSXName,
  transformMachineName
} = require('./utils')

const {
  writeAtomicDirIndex,
  writeLibraryIndex,
  writeLibraryScssFile,
  writeLibraryDataFile
} = require('../common-utils/files')
const { getPathToLib } = require('../common-utils')

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
  // get directory that component will be created in
  const { targetDir } = await askTargetDir(process.cwd(), 'where should we create the component?')
  // const { subdir } = await askSubDir(targetDir)
  // subdir will be "" if no sub directories are found
  const destination = await drillSubdirs(targetDir)
  const pathToLib = getPathToLib(destination, libName)

  // get name of the new component. Input can be anything, below functions 
  // will transform input into usable formats
  const component = await askComponentName()
  // transformJSXName procudes a Pascal Case string, e.g. 'login form' -> 'LoginForm'
  const jsxName = transformJSXName(component.componentName)
  // transformMachineName procudes a hyphenated, lower case string, e.g. 'Login Form' -> login-form
  const machineName = transformMachineName(component.componentName)

  // create new directory based on targetDir and componentName
  try {
    await mkdir(`${destination}/${jsxName}`)
    // get array of files to be included in the directory
    const { filesInclude } = await askFilesInclude()

    /**
     * CREATE FILES
     */
    // write the new component files to the directory created above
    // create js file
    if (filesInclude.indexOf('js') >= 0) {
      await writeJSFile(jsxName, machineName, `${destination}/${jsxName}`)
    }
    // create sass file
    if (filesInclude.indexOf('sass') >= 0) {
      await writeSassFile(machineName, `${destination}/${jsxName}`)
    }
    // create test file
    if (filesInclude.indexOf('test') >= 0) {
      await writeTestFile(jsxName, `${destination}/${jsxName}`)
    }
    // create data file
    if (filesInclude.indexOf('data') >= 0) {
      await writeDataFile(`${destination}/${jsxName}`)
    }

    /**
     * REWRITE INDEX FILES
     */
    // write file to atomic dir index
    writeAtomicDirIndex(destination)
    // write file to library index
    writeLibraryIndex(pathToLib)
    // write file to library scss
    writeLibraryScssFile(pathToLib)
    // write file to library data
    writeLibraryDataFile(pathToLib)
  }
  catch (err) {
    console.error(
      chalk.red(err)
    )
  }
}

module.exports = run