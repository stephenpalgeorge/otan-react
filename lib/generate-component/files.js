const fs = require('fs')
const chalk = require('chalk')
const util = require('util')

const {
  componentDataFile,
  componentJsFile,
  componentSassFile,
  componentTestFile
} = require('./file-contents')

const writeFile = util.promisify(fs.writeFile)

module.exports = {
  /**
   * CREATE COMPONENT JS FILE
   */
  // the basic component js file
  writeJSFile: async (jsxName, machineName, targetDir) => {
    try {
      writeFile(`${targetDir}/${jsxName}.js`, componentJsFile(jsxName, machineName))
        console.log(
          `${chalk.green(`created file: `)} ${targetDir}/${jsxName}.js`
        )
    }
    catch (err) {
      console.error(
        chalk.red(err)
      )
    }
  },
  /**
   * CREATE COMPONENT SASS FILE
   */
  // a Sass partial, this file is included in library.scss
  writeSassFile: (machineName, targetDir) => {
    try {
      writeFile(`${targetDir}/_${machineName}.scss`, componentSassFile(machineName))
      console.log(
        `${chalk.green(`created file: `)} ${targetDir}/_${machineName}.scss`
      )
    }
    catch (err) {
      console.error(
        chalk.red(err)
      )
    }
  },
  /**
   * CREATE COMPONENT TEST FILE
   */
  // .test.js template file, includes a simple rendering test
  writeTestFile: (jsxName, targetDir) => {
    try {
      writeFile(`${targetDir}/${jsxName}.test.js`, componentTestFile(jsxName))
      console.log(
        `${chalk.green(`created file: `)} ${targetDir}/${jsxName}.test.js`
      )
    }
    catch (err) {
      console.error(
        chalk.red(err)
      )
    }
  },
  // basic object exported, intended to contain props values
  writeDataFile: targetDir => {
    try {
      writeFile(`${targetDir}/data.js`, componentDataFile())
      console.log(
        `${chalk.green(`created file: `)} ${targetDir}/data.js`
      )
    }
    catch (err) {
      console.error(
        chalk.red(err)
      )
    }
  }
}