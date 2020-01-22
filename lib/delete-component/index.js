const clear = require("clear")
const chalk = require("chalk")
const figlet = require("figlet")
const fs = require("fs")

const { askSubDir, askTargetDir } = require("./inquirer")

clear()
console.log(figlet.textSync('Loris React', {
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

  const atomicDir = `${targetDir}/${subdir}`
  const component = await askSubDir(atomicDir)

  const target = `${targetDir}/${subdir}/${component.subdir}`
}

module.exports = run