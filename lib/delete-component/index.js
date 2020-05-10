const clear = require("clear")
const chalk = require("chalk")
const figlet = require("figlet")

const { askSubDir, askTargetDir, confirmDelete } = require("./inquirer")
const { getShortPath } = require('../utils')
const {
  writeAtomicDirIndex,
  writeLibraryIndex,
  writeLibraryScssFile,
  writeLibraryDataFile
} = require('../utils/files')
const { deleteDir } = require('./utils')

clear()
console.log(figlet.textSync('Orangutan', {
    horizontalLayout: "default"
}))

const run = async () => {
  /**
   * GET USER INPUT
   */
  // get component directory that is to be deleted
  const { targetDir } = await askTargetDir(process.cwd())
  const { subdir } = await askSubDir(targetDir)

  // exit function if no component is selected
  if (subdir.length <= 0) return

  // get path to the target component
  const atomicDir = `${targetDir}/${subdir}`
  const component = await askSubDir(atomicDir)

  const target = `${targetDir}/${subdir}/${component.subdir}`
  // make user confirm delete
  console.log(
    chalk.red(`About to delete component: ${target}`)
  )

  const { confirmDelete: deleteComponent } = await confirmDelete(getShortPath(target))
  
  // if they do not want to delete the component, give a confirmation
  // message and then exit the function
  if (!deleteComponent) {
    console.log(
      chalk.yellow(`ok, nothing will be deleted...phew!`)
    )
    return
  }
  // if they do want to delete the component, continue
  else {
    deleteDir(target)
    writeAtomicDirIndex(atomicDir)
    writeLibraryIndex(targetDir)
    writeLibraryScssFile(targetDir)
    writeLibraryDataFile(targetDir)

    console.log("we've also removed all of the imports/exports for this component.")
  }
}

module.exports = run