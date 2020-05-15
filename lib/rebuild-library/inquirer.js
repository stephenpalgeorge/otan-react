const inquirer = require("inquirer")

module.exports = {
  // check user wants to create library in current directory
  askConfirmRebuild: path => {
    const questions = [
      {
        type: 'confirm',
        name: 'confirmRebuild',
        message: `We'll rebuild the library: ${path},\nis this correct?`,
        default: true
      }
    ]

    return inquirer.prompt(questions)
  }
}