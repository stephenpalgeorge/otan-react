const chalk = require('chalk')
const fs = require('fs')
const util = require('util')
const { getShortDirPath } = require('./utils')

// generate promise based fs functions
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

module.exports = {
    // create the initial (blank) index file in the library directory
    writeLibraryJsFile: async libName => {
        try {
            writeFile(`${process.cwd()}/${libName}/index.js`, "")
            console.log(
                `${chalk.green(`created file: `)} ${getShortDirPath(process.cwd())}/${libName}/index.js`
            )
        }
        catch (err) {
            console.error(
                chalk.red(err)
            )
        }
    },
    // create the initial (blank) sass file in the library directory
    writeLibraryScssFile: async libName => {
        try {
            writeFile(`${process.cwd()}/${libName}/library.scss`, "")
            console.log(
                `${chalk.green(`created file: `)} ${getShortDirPath(process.cwd())}/${libName}/library.scss`
            )
        }
        catch (err) {
            console.error(
                chalk.red(err)
            )
        }
    },
    writeLibraryDataFile: async libName => {
        try {
            writeFile(`${process.cwd()}/${libName}/data.js`, "")
            console.log(
                `${chalk.green(`created file: `)} ${getShortDirPath(process.cwd())}/${libName}/data.js`
            )
        }
        catch (err) {
            console.error(
                chalk.red(err)
            )
        }
    },
    // create the library directory
    mkDirLibrary: async libName => {
        try {
            mkdir(`${process.cwd()}/${libName}`)
            console.log(
                `${chalk.green(`created dir: `)} ${getShortDirPath(process.cwd())}/${libName}`
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
    mkAtomicDir: async (libName, dirname) => {
        try {
            await mkdir(`${libName}/${dirname}`)
            writeFile(`${libName}/${dirname}/index.js`, "")
            console.log(
                `${chalk.green(`created dir: `)} ${libName}/${dirname}`
            )
        }
        catch (err) {
            console.error(
                chalk.red(err)
            )
        }
    }
}