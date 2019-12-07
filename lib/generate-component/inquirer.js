const inquirer = require('inquirer')

const { filterForDirs, getShortPath, hasSubDirs } = require('./utils')

module.exports = {
    // user selects a directory to create the component in
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
    // if the targetDir (see above) has directories within it, 
    // ask which of those should be used
    askSubDir: source => {
        if (!hasSubDirs(source)) {
            return { subdir: "" }
        }
        else {
            const questions = [
                {
                    type: 'list',
                    name: 'subdir',
                    // @todo, include './' as an option
                    choices: filterForDirs(source).map(getShortPath)
                }
            ]
    
            return inquirer.prompt(questions)
        }
    },
    // user enters the name of the component
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
    // user selects which files should be added to the component directory
    askFilesInclude: () => {
        const questions = [
            {
                type: 'checkbox',
                name: 'filesInclude',
                message: 'which files do you want to generate?',
                choices: ['js', 'sass', 'data', 'test'],
                default: ['js', 'sass', 'data', 'test']
            }
        ]

        return inquirer.prompt(questions)
    }
}