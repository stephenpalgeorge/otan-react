const fs = require('fs')
const chalk = require('chalk')
const util = require('util')

const {
    componentDataFile,
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
    writeDataFile: targetDir => {
        try {
            writeFile(`${targetDir}/data.js`, componentDataFile())
            console.log(
                chalk.green(`created file: ${targetDir}/data.js`)
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
            indexFileStream.write("\nexport {")
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
    },
    /**
     * WRITE FILE TO LIBRARY INDEX
     */
    writeLibraryIndex: (library) => {
        try {
            // get all atomic dirs (pass library directory here)
            const atomicDirs = filterForDirs(library)
            // setup placeholder object
            let indexContents = {
                allComponents: []
            }
            // iterate over atomicDirs and structure data in
            // indexContents object
            for (const dir of atomicDirs) {
                let dirname = getShortPath(dir)
                indexContents[dirname] = []
                const components = filterForDirs(dir)
                for (const component of components) {
                    indexContents[dirname].push(getShortPath(component))
                }
            }
            // if library/index.js exists, remove it before we 
            // start writing the new one
            if (fs.existsSync(`${library}/index.js`)) {
                fs.unlinkSync(`${library}/index.js`)
            }

            // setup writestream to create new index
            const indexFileStream = fs.createWriteStream(`${library}/index.js`, {flags: 'a'})
            // loop over all entriess in indexContents
            // ----------
            // WRITE IMPORTS
            // ----------
            for (let [parent, componentArray] of Object.entries(indexContents)) {
                // check atomicDir has components
                if (componentArray.length > 0) {
                    indexFileStream.write("import {")
                    for (const component of componentArray) {
                        // add component to allComponents array
                        indexContents.allComponents.push(component)
                        // check if component is last in the index and don't write comma at 
                        // the end of the string if it is
                        if (componentArray.indexOf(component) === componentArray.length - 1) {
                            indexFileStream.write(`\n  ${component}`)
                        }
                        else {
                            indexFileStream.write(`\n  ${component},`)
                        }
                    }
                    indexFileStream.write(`\n} from "./${parent}"\n\n`)
                }
            }
            
            // ----------
            // WRITE EXPORTS
            // ----------
            indexFileStream.write("\nexport {")
            for (let component of indexContents.allComponents.sort()) {
                if (indexContents.allComponents.sort().indexOf(component) === indexContents.allComponents.length - 1) {
                    // check if component is last in the index and don't write comma at 
                    // the end of the string if it is
                    indexFileStream.write(`\n  ${component}`)
                }
                else {
                    indexFileStream.write(`\n  ${component},`)
                }
            }
            indexFileStream.write("\n}")
        }
        catch (err) {
            console.error(err)
        }
    }
}