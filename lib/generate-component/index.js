#!/usr/bin/env node

const clear = require('clear')
const figlet = require('figlet')
const fs = require('fs')
const util = require('util')

const mkdir = util.promisify(fs.mkdir)

const { askComponentName, askFilesInclude, askSubDir, askTargetDir } = require('./inquirer')
const { writeAtomicDirIndex, writeDataFile, writeJSFile, writeLibraryIndex, writeLibraryScssFile, writeSassFile, writeTestFile } = require('./files')
const { transformJSXName, transformMachineName } = require('./utils')

clear()
console.log(figlet.textSync('Loris React', {
    horizontalLayout: "default"
}))

const run = async () => {
    /**
     * GET USER INPUT
     */
    // get directory that component will be created in
    const { targetDir } = await askTargetDir(process.cwd())
    const { subdir } = await askSubDir(targetDir)
    const destination = subdir.length > 0 ? `${targetDir}/${subdir}` : targetDir

    // get name of the new component & transform into machine readalbe string
    const component = await askComponentName()
    const jsxName = transformJSXName(component.componentName)
    const machineName = transformMachineName(component.componentName)

    // create new directory based on targetDir and componentName
    try {
        mkdir(`${destination}/${jsxName}`)
    }
    catch (err) {
        console.error(err)
    }

    // get array of files to be included in the directory
    const { filesInclude } = await askFilesInclude()

    /**
     * CREATE FILES
     */
    // create js file
    if (filesInclude.indexOf('js') >= 0) {
        await writeJSFile(jsxName, machineName, `${destination}/${jsxName}`)
    }
    // create sass file
    if (filesInclude.indexOf('sass') >= 0) {
        await writeSassFile(machineName, `${destination}/${jsxName}`)
    }
    // create test file
    if (filesInclude.indexOf('test') >= 0) {
        await writeTestFile(jsxName, `${destination}/${jsxName}`)
    }
    // create data file
    if (filesInclude.indexOf('data') >= 0) {
        await writeDataFile(`${destination}/${jsxName}`)
    }

    // write file to atomic dir index
    writeAtomicDirIndex(destination)
    // write file to library index
    writeLibraryIndex(targetDir)
    // write file to library scss
    writeLibraryScssFile(targetDir)
}

run()