const fs = require('fs')
const chalk = require('chalk')
const util = require('util')

const { transformJSXName } = require('./utils')
const {
    componentJsFile,
    componentSassFile,
    componentDefaultsFile,
    defaultsImport,
    defaultPropsContent
} = require('./file-contents')

const writeFile = util.promisify(fs.writeFile)

module.exports = {
    /**
     * CREATE COMPONENT JS FILE
     */
    writeJSFile: async (componentName, targetDir) => {
        const jsxName = transformJSXName(componentName)

        try {
            writeFile(`${targetDir}/${componentName}.js`, componentJsFile(componentName, jsxName))
            console.log(
                chalk.green(`create file: ${targetDir}/${componentName}.js`)
            )
        }
        catch (err) {
            console.error(err)
        }
    },
    /**
     * CREATE COMPONENT SASS FILE
     */
    writeSassFile: (componentName, targetDir) => {
        try {
            writeFile(`${targetDir}/_${componentName}.scss`, componentSassFile(componentName))
            console.log(
                chalk.green(`created file: ${targetDir}/_${componentName}.scss`)
            )
        }
        catch (err) {
            console.error(err)
        }
    }
}