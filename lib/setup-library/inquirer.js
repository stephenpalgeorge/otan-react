const inquirer = require('inquirer')
const { getShortDirPath } = require('./utils')

module.exports = {
    askConfirmSetup: currentDir => {
        const questions = [
            {
                type: 'confirm',
                name: 'confirmSetup',
                message: `We'll create an atomic component library in directory: ${getShortDirPath(currentDir)},\nis this the correct location?`,
                default: true
            }
        ]

        return inquirer.prompt(questions)
    },
    askAtomicDirs: () => {
        const questions = [
            {
                type: 'checkbox',
                name: 'atomicDirs',
                message: 'which directories do you want to include in your library?',
                default: ["01-atoms", "02-molecules", "03-organisms"],
                choices: ["00-protons", "01-atoms", "02-molecules", "03-organisms", "04-layouts"],
                validate: choices => {
                    if (choices.length) {
                        return true
                    }
                    else {
                        return 'please choose your directories:'
                    }
                }
            }
        ]

        return inquirer.prompt(questions)
    }
}