const chalk = require('chalk')
const fs = require('fs')
const util = require('util')
const { getShortDirPath } = require('./utils')

// generate promise based fs functions
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

module.exports = {
    // create the initial (blank) index file in the library directory
    writeLibraryJsFile: async () => {
        try {
            writeFile(`${process.cwd()}/library/index.js`, "")
            console.log(
                chalk.green(`created file: ${getShortDirPath(process.cwd())}/library/index.js`)
            )
        }
        catch (err) {
            console.error(
                chalk.red(err)
            )
        }
    },
    // create the initial (blank) sass file in the library directory
    writeLibraryScssFile: async () => {
        try {
            writeFile(`${process.cwd()}/library/library.scss`, "")
            console.log(
                chalk.green(`created file: ${getShortDirPath(process.cwd())}/library/library.scss`)
            )
        }
        catch (err) {
            console.error(
                chalk.red(err)
            )
        }
    },
    // create the library directory
    mkDirLibrary: async () => {
        try {
            mkdir(`${process.cwd()}/library`)
            console.log(
                chalk.green(`created dir: ${getShortDirPath(process.cwd())}/library`)
            )
        }
        catch (err) {
            console.error(
                chalk.red(err)
            )
        }
    },
    // create directory within the library directory,
    // this function will be called for each atomic directory 
    // the user selects to include in their library
    mkAtomicDir: async dirname => {
        try {
            await mkdir(`library/${dirname}`)
            writeFile(`library/${dirname}/index.js`, "")
            console.log(
                chalk.green(`created dir: library/${dirname}`)
            )
        }
        catch (err) {
            console.error(
                chalk.red(err)
            )
        }
    }
}