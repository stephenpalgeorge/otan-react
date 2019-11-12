const fs = require('fs')
const chalk = require('chalk')
const util = require('util')

const {
    componentJsFile,
    componentSassFile,
    componentTestFile
} = require('./file-contents')

const { filterForDirs, getShortPath } = require('./utils')

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
    },
    /**
     * WRITE FILE TO ATOMIC DIR INDEX
     */
    writeAtomicDirIndex: dir => {
        try {
            // get contents of directory
            const componentDirs = filterForDirs(dir)
            // if index file already exists, we remove it before 
            // we start writing the new one
            if (fs.existsSync(`${dir}/index.js`)) {
                fs.unlinkSync(`${dir}/index.js`)
            }

            // create write stream to generate index file
            const indexFileStream = fs.createWriteStream(`${dir}/index.js`, {flags: 'a'})
            // loop of contents of specified dir. Each subdir 
            // represents a component.
            for (const component of componentDirs) {
                // make sure only the component name is being used
                let name = getShortPath(component)
                // write import line for each component
                indexFileStream.write(`import ${name} from './${name}/${name}'\n`)
            }
            // construct export object
            indexFileStream.write("\nexport default {")
            for (const [i, component] of componentDirs.entries()) {
                let name = getShortPath(component)
                if (i < componentDirs.length - 1) indexFileStream.write(`\n  ${name},`)
                else indexFileStream.write(`\n  ${name}`)
            }
            indexFileStream.write("\n}")
            // close stream
            indexFileStream.end()
        }
        catch (err) {
            console.error(err)
        }
    }
}