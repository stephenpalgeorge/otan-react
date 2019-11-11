const chalk = require('chalk')
const fs = require('fs')
const util = require('util')
const { getShortDirPath } = require('./utils')

// generate promise based fs functions
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

module.exports = {
    writeLibraryJsFile: async () => {
        try {
            writeFile(`${process.cwd()}/library/index.js`, "")
            console.log(
                chalk.green(`created file: ${getShortDirPath(process.cwd())}/library.js`)
            )
        }
        catch (err) {
            console.error(err)
        }
    },
    writeLibraryScssFile: async () => {
        try {
            writeFile(`${process.cwd()}/library/library.scss`, "")
            console.log(
                chalk.green(`created file: ${getShortDirPath(process.cwd())}/library.scss`)
            )
        }
        catch (err) {
            console.error(err)
        }
    },
    mkDirLibrary: async () => {
        try {
            mkdir(`${process.cwd()}/library`)
            console.log(
                chalk.green(`created dir: ${getShortDirPath(process.cwd())}/library`)
            )
        }
        catch (err) {
            console.error(err)
        }
    },
    mkAtomicDir: async dirname => {
        try {
            await mkdir(`library/${dirname}`)
            writeFile(`library/${dirname}/index.js`, "")
            console.log(
                chalk.green(`created dir: library/${dirname}`)
            )
        }
        catch (err) {
            console.error(err)
        }
    }
}