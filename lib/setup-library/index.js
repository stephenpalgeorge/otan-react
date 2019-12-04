const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')

const { askAtomicDirs, askConfirmSetup } = require('./inquirer')
const {
    mkAtomicDir,
    mkDirLibrary,
    writeLibraryDataFile,
    writeLibraryJsFile,
    writeLibraryScssFile
} = require('./files')

clear()
console.log(figlet.textSync('Loris React', {
    horizontalLayout: "default"
}))

const run = async () => {
    const libRoot = process.cwd()
    // check user wants to create library in libRoot
    const { confirmSetup } = await askConfirmSetup(libRoot) // <-- boolean

    if (confirmSetup) {
        console.log(
            chalk.bgGreen('\ngreat :) we\'ll set things up for you...\n')
        )

        /**
         * ----------
         * CREATE FILES
         * ----------
         */
        await mkDirLibrary()
        await writeLibraryJsFile()
        await writeLibraryScssFile()
        await writeLibraryDataFile()

        // ask which directories to includes & create folder structure
        const { atomicDirs } = await askAtomicDirs()
        async function setupAtomicDirs() {
            for (const dir of atomicDirs) {
                await mkAtomicDir(dir)
            }
        }
        await setupAtomicDirs()
    }
    else {
        console.log(
            chalk.yellow('no worries, cd into the correct directory and run the command again\n')
        )
    }
}

module.exports = run