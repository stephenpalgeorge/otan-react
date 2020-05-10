const clear = require('clear')
const figlet = require('figlet')
const chalk = require('chalk')
const fs = require('fs')
const util = require('util')

const mkdir = util.promisify(fs.mkdir)

const {
  askComponentName,
  askFilesInclude,
  askSubDir,
  askTargetDir
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
} = require('../utils/files')

clear()
console.log(figlet.textSync('Orangutan', {
  horizontalLayout: "default"
}))

const run = async () => {
  /**
   * GET USER INPUT
   */
  // get directory that component will be created in
  const { targetDir } = await askTargetDir(process.cwd())
  const { subdir } = await askSubDir(targetDir)
  // subdir will be "" if no sub directories are found
  const destination = subdir.length > 0 ? `${targetDir}/${subdir}` : targetDir

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
    writeLibraryIndex(targetDir)
    // write file to library scss
    writeLibraryScssFile(targetDir)
    // write file to library data
    writeLibraryDataFile(targetDir)
  }
  catch (err) {
    console.error(
      chalk.red(err)
    )
  }
}

module.exports = run