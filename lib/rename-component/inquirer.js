const inquirer = require('inquirer')

module.exports = {
  askNewName: () => {
    const questions = [
      {
        type: 'input',
        name: 'newComponentName',
        message: 'what shall we rename it to?',
        validate: value => {
          if (value.length) {
            return true
          }
          else {
            return 'please enter a new name for the component'
          }
        }
      }
    ]

    return inquirer.prompt(questions)
  }
}