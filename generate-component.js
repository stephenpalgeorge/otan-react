const clear = require('clear')
const figlet = require('figlet')
const fs = require('fs')
const util = require('util')

const mkdir = util.promisify(fs.mkdir)

const { askComponentName, askFilesInclude, askTargetDir } = require('./lib/generate-component/inquirer')
const { writeJSFile, writeSassFile, writeTestFile } = require('./lib/generate-component/files')
const { transformJSXName, transformMachineName } = require('./lib/generate-component/utils')

clear()
console.log(figlet.textSync('Loris React', {
    horizontalLayout: "default"
}))

const run = async () => {
    /**
     * GET USER INPUT
     */
    // get directory that component will be created in
    const { targetDir } = await askTargetDir()
    // get name of the new component & transform into machine readalbe string
    const component = await askComponentName()
    const jsxName = transformJSXName(component.componentName)
    const machineName = transformMachineName(component.componentName)

    // create new directory based on targetDir and componentName
    try {
        mkdir(`${targetDir}/${jsxName}`)
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
        await writeJSFile(jsxName, machineName, `${targetDir}/${jsxName}`)
    }
    // create sass file
    if (filesInclude.indexOf('sass') >= 0) {
        await writeSassFile(machineName, `${targetDir}/${jsxName}`)
    }
    // create test file
    if (filesInclude.indexOf('test') >= 0) {
        await writeTestFile(jsxName, `${targetDir}/${jsxName}`)
    }
}

run()