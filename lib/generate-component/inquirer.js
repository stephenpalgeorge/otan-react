const inquirer = require('inquirer')

module.exports = {
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