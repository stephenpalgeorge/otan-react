const clear = require('clear')
const figlet = require('figlet')
const fs = require('fs')

const { askComponentName, askFilesInclude, askTargetDir } = require('./lib/inquirer')
const { writeJSFile } = require('./lib/files')
const { transformComponentName } = require('./lib/utils')

clear()
console.log(figlet.textSync('Loris React', {
    horizontalLayout: "default"
}))

const run = async () => {
    /**
     * GET USER INPUT
     */
    // get directory that component will be created in
    const directory = await askTargetDir()
    // get name of the new component & transform into machine readalbe string
    const component = await askComponentName()
    const componentName = transformComponentName(component.componentName)

    // create new directory based on targetDir and componentName
    await fs.mkdir(`${directory.targetDir}/${componentName}`, err => {
        if (err) console.error(err)
    })

    // get array of files to be included in the directory
    const files = await askFilesInclude()

    /**
     * CREATE FILES
     */
    // create js file
    if (files.filesInclude.indexOf('js') >= 0) {
        writeJSFile(componentName, `${directory.targetDir}/${componentName}`)
    }
}

run()