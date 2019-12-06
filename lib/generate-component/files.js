const fs = require('fs')
const chalk = require('chalk')
const util = require('util')

const {
    componentDataFile,
    componentJsFile,
    componentSassFile,
    componentTestFile
} = require('./file-contents')

const { filterForDirs, getShortPath, transformComponentToSassName } = require('./utils')

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
    },
    /**
     * WRITE FILE TO ATOMIC DIR INDEX
     */
    // this is the file that indexes all components in that directory, e.g.
    // 01-atoms/index.js. All components in 01-atoms are imported and exported
    // to then be included in the library/index.js file.
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
            console.error(
                chalk.red(err)
            )
        }
    },
    /**
     * WRITE FILE TO LIBRARY INDEX
     */
    // this is root index file for the component library, e.g.
    // library/index.js. This indexes all components in the library. 
    // Every atomic directory's contents is imported and exported
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
            // ----------
            // WRITE IMPORTS
            // ----------
            // loop over all entriess in indexContents
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
            console.error(
                chalk.red(err)
            )
        }
    },
    /**
     * ----------
     * WRITE LIBRARY SCSS FILE
     * ----------
     */
    // imports all sass partials from the library components.
    // This is the file that a user should @import in their own
    // sass code
    writeLibraryScssFile: (library) => {
        try {
            // get all atomic dirs (pass library directory here)
            const atomicDirs = filterForDirs(library)
            // setup placeholder object
            let indexContents = {}
            // iterate over atomicDirs and structure data in
            // indexContents object
            for (const dir of atomicDirs) {
                let dirname = getShortPath(dir)
                indexContents[dirname] = []
                const components = filterForDirs(dir)
                for (const component of components) {
                    let sassName = transformComponentToSassName(getShortPath(component))
                    if (fs.existsSync(`${component}/_${sassName}.scss`)) {
                        indexContents[dirname].push(component)
                    }
                }
            }
            // if library/index.js exists, remove it before we 
            // start writing the new one
            if (fs.existsSync(`${library}/library.scss`)) {
                fs.unlinkSync(`${library}/library.scss`)
            }

            // setup writestream to create new index
            const indexFileStream = fs.createWriteStream(`${library}/library.scss`, {flags: 'a'})
            indexFileStream.write(`// import styles for all components that were created with a sass file\n// if you have since added a sass file to a component, you will need to manually\n// include it here`)
            // ----------
            // WRITE IMPORTS
            // ----------
            for (let [parent, componentArray] of Object.entries(indexContents)) {
                // check atomicDir has components
                if (componentArray.length > 0) {
                    // include comments
                    indexFileStream.write(`\n\n// import styles for ${parent}`)

                    for (let component of componentArray) {
                        let componentName = getShortPath(component)
                        indexFileStream.write(`\n@import './${parent}/${componentName}/${transformComponentToSassName(componentName)}';`)
                    }
                }
            }
        }
        catch (err) {
            console.error(
                chalk.red(err)
            )
        }
    },
    /**
     * ----------
     * WRITE LIBRARY DATA FILE
     * ----------
     */
    // imports all data.js files from every atomic directory 
    // and exports them for more streamlined referencing
    writeLibraryDataFile: library => {
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
                    if (fs.existsSync(`${component}/data.js`)) {
                        indexContents[dirname].push(component)
                    }
                }
            }
            // if library/data.js exists, remove it before we 
            // start writing the new one
            if (fs.existsSync(`${library}/data.js`)) {
                fs.unlinkSync(`${library}/data.js`)
            }

            // setup writestream to create new index
            const indexFileStream = fs.createWriteStream(`${library}/data.js`, {flags: 'a'})
            indexFileStream.write(`// import all data objects for every component \n// that was created with a data.js file\n`)
            // ----------
            // WRITE IMPORTS
            // ----------
            for (let [parent, componentArray] of Object.entries(indexContents)) {
                // check atomicDir has components
                if (componentArray.length > 0) {
                    indexFileStream.write(`\nimport {`)
                    for (let component of componentArray) {
                        indexContents.allComponents.push(component)
                        let componentName = getShortPath(component)
                        if (componentArray.indexOf(component) === componentArray.length - 1) {
                            indexFileStream.write(`\n  ${componentName}`)
                        }
                        else {
                            indexFileStream.write(`\n  ${componentName},`)
                        }
                    }
                    indexFileStream.write(`\n} from './${parent}'\n`)
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
                    indexFileStream.write(`\n  ${getShortPath(component)}`)
                }
                else {
                    indexFileStream.write(`\n  ${ getShortPath(component)},`)
                }
            }
            indexFileStream.write("\n}")
        }
        catch (err) {
            console.log(
                chalk.red(err)
            )
        }
    }
}