const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const fs = require('fs')

const {
  askAtomicDirs,
  askConfirmSetup,
  askTargetDir,
  askSubDir
} = require('./inquirer')
const {
    mkAtomicDir,
    mkDirLibrary,
    writeLibraryDataFile,
    writeLibraryJsFile,
    writeLibraryScssFile
} = require('./files')

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
    if (subdir === "" || subdir === '/') return path.join('/')
    // otherwise, ask again...
    else return await drillSubdirs(subdir, path)
  }
    
  const { targetDir } = await askTargetDir(process.cwd())
  const destination = await drillSubdirs(targetDir)
  // check user wants to create library in destination
  const { confirmSetup } = await askConfirmSetup(destination, libName) // <-- boolean

  if (fs.existsSync(`${destination}/${libName}`)) {
      console.log(
          chalk.yellow(`
  there is already a library directory at this location.
  Create your loris library somewhere else,
  or rename your current library directory
          `)
      )
      return   
  }
  if (confirmSetup) {
    console.log(`${chalk.bgGreen('\n great :) ')} we\'ll set things up for you...\n`)

    /**
     * ----------
     * CREATE FILES
     * ----------
     */
    await mkDirLibrary(destination, libName)
    await writeLibraryJsFile(destination, libName)
    await writeLibraryScssFile(destination, libName)
    await writeLibraryDataFile(destination, libName)

    // ask which directories to includes & create folder structure
    const { atomicDirs } = await askAtomicDirs()
    async function setupAtomicDirs() {
        for (const dir of atomicDirs) {
            await mkAtomicDir(destination, libName, dir)
        }
    }
    await setupAtomicDirs()
    
    // end of process message
    console.log(
        `\n${chalk.green('library created')}\nRun ${chalk.bgBlackBright('otan-react new')} to generate a new component`
    )
  }
  else {
    console.log(chalk.yellow('no worries, run the command again\n'))
    return
  }
}

module.exports = run