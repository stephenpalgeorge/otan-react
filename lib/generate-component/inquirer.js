const inquirer = require('inquirer')

const { filterForDirs, getShortPath, hasSubDirs } = require('./utils')

module.exports = {
    askTargetDir: source => {
        const questions = [
            {
                type: 'list',
                name: 'targetDir',
                message: 'where should we create the component?',
                choices: filterForDirs(source).map(getShortPath)
            }
        ]

        return inquirer.prompt(questions)
    },
    askSubDir: source => {
        if (!hasSubDirs(source)) {
            return { subdir: "" }
        }
        else {
            const questions = [
                {
                    type: 'list',
                    name: 'subdir',
                    choices: filterForDirs(source).map(getShortPath)
                }
            ]
    
            return inquirer.prompt(questions)
        }
    },
    askComponentName: () => {
        const questions = [
            {
                type: 'input',
                name: 'componentName',
                message: 'what should we call the component?',
                validate: value => {
                    if (value.length) {
                        return true
                    }
                    else {
                        return 'please enter a component name:'
                    }
                }
            }
        ]

        return inquirer.prompt(questions)
    },
    askFilesInclude: () => {
        const questions = [
            {
                type: 'checkbox',
                name: 'filesInclude',
                message: 'which files do you want to generate?',
                choices: ['js', 'sass', 'test'],
                default: ['js', 'test']
            }
        ]

        return inquirer.prompt(questions)
    }
}