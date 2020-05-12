const chalk = require('chalk')
const fs = require('fs')
const util = require('util')
const { getShortDirPath } = require('./utils')

// generate promise based fs functions
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

module.exports = {
    // create the initial (blank) index file in the library directory
    writeLibraryJsFile: async (path, libName) => {
        try {
            writeFile(`${path}/${libName}/index.js`, "")
            console.log(
                `${chalk.green(`created file: `)} ${getShortDirPath(path)}/${libName}/index.js`
            )
        }
        catch (err) {
            console.error(
                chalk.red(err)
            )
        }
    },
    // create the initial (blank) sass file in the library directory
    writeLibraryScssFile: async (path, libName) => {
        try {
            writeFile(`${path}/${libName}/library.scss`, "")
            console.log(
                `${chalk.green(`created file: `)} ${getShortDirPath(path)}/${libName}/library.scss`
            )
        }
        catch (err) {
            console.error(
                chalk.red(err)
            )
        }
    },
    writeLibraryDataFile: async (path, libName) => {
        try {
            writeFile(`${path}/${libName}/data.js`, "")
            console.log(
                `${chalk.green(`created file: `)} ${getShortDirPath(path)}/${libName}/data.js`
            )
        }
        catch (err) {
            console.error(
                chalk.red(err)
            )
        }
    },
    // create the library directory
    mkDirLibrary: async (path, libName) => {
        try {
            mkdir(`${path}/${libName}`)
            console.log(
                `${chalk.green(`created dir: `)} ${getShortDirPath(path)}/${libName}`
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
    mkAtomicDir: async (path, libName, dirname) => {
        try {
            await mkdir(`${path}/${libName}/${dirname}`)
            writeFile(`${path}/${libName}/${dirname}/index.js`, "")
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