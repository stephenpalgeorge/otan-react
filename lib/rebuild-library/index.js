const clear = require("clear")
const chalk = require("chalk")
const figlet = require("figlet")
const fs = require("fs")

const { askSubDir, askTargetDir } = require("../common-inquirer")
const { askConfirmRebuild } = require('./inquirer')
const {
  writeAtomicDirIndex,
  writeLibraryIndex,
  writeLibraryScssFile,
  writeLibraryDataFile
} = require('../common-utils/files')
const { useConfig } = require('../common-utils')

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
  /**
   * GET USER INPUT
   */
  // get liibrary directory that is to be rebuilt
  const { targetDir } = await askTargetDir(process.cwd(), "select the library to rebuild")
  const destination = await drillSubdirs(targetDir)

  const { confirmRebuild } = await askConfirmRebuild(destination)
 
  if (confirmRebuild) {
    try {
      // rewrite atomic index file for each allowed directory
      useConfig().dirnames.forEach(dir => {
        const dirPath = `${destination}/${dir}`
        if (fs.existsSync(dirPath)) writeAtomicDirIndex(dirPath)
      })
      // rewrite library indexes
      writeLibraryIndex(destination)
      writeLibraryScssFile(destination)
      writeLibraryDataFile(destination)
      
      console.log(`${chalk.yellow(`Rebuilt index files:`)} ${destination}`)
    }
    catch (err) {
      console.error(chalk.red(err))
    }
  }
  else console.log(`${chalk.yellow('No worries, nothing rebuilt :)')}`)
}

module.exports = run