const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')

const { askAtomicDirs, askConfirmSetup } = require('./inquirer')
const { mkAtomicDir, mkDirLibrary, writeLibraryJsFile, writeLibraryScssFile } = require('./files')

clear()
console.log(figlet.textSync('Loris React', {
    horizontalLayout: "default"
}))

const run = async () => {
    const libRoot = process.cwd()
    const { confirmSetup } = await askConfirmSetup(libRoot) // <-- boolean

    if (confirmSetup) {
        console.log(
            chalk.bgGreen('great :) we\'ll set things up for you...')
        )

        /**
         * CREATE FILES
         */
        await mkDirLibrary()
        await writeLibraryJsFile()
        await writeLibraryScssFile()

        // ask which directories to includes & create folder structure
        const { atomicDirs } = await askAtomicDirs()
        atomicDirs.forEach(async dir => {
            await mkAtomicDir(dir)
        })
    }
    else {
        console.log(
            chalk.yellow('no worries, cd into the correct directory and run "loris start" again')
        )
    }
}

run()