const fs = require('fs')
const chalk = require('chalk')
const util = require('util')

const {
    componentJsFile,
    componentSassFile,
    componentTestFile
} = require('./file-contents')

const writeFile = util.promisify(fs.writeFile)

module.exports = {
    /**
     * CREATE COMPONENT JS FILE
     */
    writeJSFile: async (jsxName, machineName, targetDir) => {
        try {
            writeFile(`${targetDir}/${jsxName}.js`, componentJsFile(jsxName, machineName))
            console.log(
                chalk.green(`created file: ${targetDir}/${jsxName}.js`)
            )
        }
        catch (err) {
            console.error(err)
        }
    },
    /**
     * CREATE COMPONENT SASS FILE
     */
    writeSassFile: (machineName, targetDir) => {
        try {
            writeFile(`${targetDir}/_${machineName}.scss`, componentSassFile(machineName))
            console.log(
                chalk.green(`created file: ${targetDir}/_${machineName}.scss`)
            )
        }
        catch (err) {
            console.error(err)
        }
    },
    /**
     * CREATE COMPONENT TEST FILE
     */
    writeTestFile: (jsxName, targetDir) => {
        try {
            writeFile(`${targetDir}/${jsxName}.test.js`, componentTestFile(jsxName))
            console.log(
                chalk.green(`created file: ${targetDir}/${jsxName}.test.js`)
            )
        }
        catch (err) {
            console.error(err)
        }
    }
}