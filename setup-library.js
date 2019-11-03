const fs = require('fs')

const { askConfirmSetup } = require('./lib/setup-library/inquirer')

const run = async () => {
    const libRoot = process.cwd()
    askConfirmSetup(libRoot)
}

run()