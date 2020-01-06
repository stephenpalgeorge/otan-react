const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const fs = require('fs')

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

const run = async (libName = "library") => {
    const libRoot = process.cwd()
    // check user wants to create library in libRoot
    const { confirmSetup } = await askConfirmSetup(libRoot, libName) // <-- boolean

    if (fs.existsSync(`${libRoot}/${libName}`)) {
        console.log(
            chalk.yellow(`
    there is already a library directory at this location.
    Create your loris library somewhere else,
    or rename your current library directory
            `)
        )
        return   
    }
    if (confirmSetup) {
        console.log(
            `${chalk.bgGreen('\n great :) ')} we\'ll set things up for you...\n`
        )

        /**
         * ----------
         * CREATE FILES
         * ----------
         */
        await mkDirLibrary(libName)
        await writeLibraryJsFile(libName)
        await writeLibraryScssFile(libName)
        await writeLibraryDataFile(libName)

        // ask which directories to includes & create folder structure
        const { atomicDirs } = await askAtomicDirs()
        async function setupAtomicDirs() {
            for (const dir of atomicDirs) {
                await mkAtomicDir(libName, dir)
            }
        }
        await setupAtomicDirs()
        
        // end of process message
        console.log(
            `\n${chalk.green('library created')}\nRun ${chalk.bgBlackBright('loris-react new')} to generate a new component`
        )
    }
    else {
        console.log(
            chalk.yellow('no worries, cd into the correct directory and run the command again\n')
        )
    }
}

module.exports = run