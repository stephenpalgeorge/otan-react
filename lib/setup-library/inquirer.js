const inquirer = require('inquirer')

module.exports = {
    askConfirmSetup: (currentDir) => {
        const questions = [
            {
                type: 'confirm',
                name: 'confirmSetup',
                message: `We'll create an atomic component library in directory: ${currentDir},\nis this the correct location?`,
                default: true
            }
        ]

        return inquirer.prompt(questions)
    }
}