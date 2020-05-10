const clear = require("clear")
const chalk = require("chalk")
const figlet = require("figlet")
const fs = require("fs")

const { askTargetDir } = require("./inquirer")
const {
  writeAtomicDirIndex,
  writeLibraryIndex,
  writeLibraryScssFile,
  writeLibraryDataFile
} = require('../utils/files')
const { useConfig } = require('../utils')

clear()
console.log(figlet.textSync('Orangutan', {
    horizontalLayout: "default"
}))

const run = async () => {
  /**
   * GET USER INPUT
   */
  // get liibrary directory that is to be rebuilt
  const { targetDir } = await askTargetDir(process.cwd())
  
  try {
    // rewrite atomic index file for each allowed directory
    useConfig().dirnames.forEach(dir => {
      const dirPath = `${targetDir}/${dir}`
      if (fs.existsSync(dirPath)) writeAtomicDirIndex(dirPath)
    })
    // rewrite library indexes
    writeLibraryIndex(targetDir)
    writeLibraryScssFile(targetDir)
    writeLibraryDataFile(targetDir)
    
    console.log(
      `${chalk.yellow(`Rebuilt index files:`)} ${targetDir}`
    )
  }
  catch (err) {
    console.error(
      chalk.red(err)
    )
  }
}

module.exports = run