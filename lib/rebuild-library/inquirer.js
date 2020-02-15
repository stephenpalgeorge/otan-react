const inquirer = require("inquirer")

const { filterForDirs, getShortPath } = require('../utils')

module.exports = {
  // user selects component to remove
  askTargetDir: source => {
    const questions = [
      {
        type: "list",
        name: "targetDir",
        message: "select the library to rebuild",
        choices: filterForDirs(source).map(getShortPath)
      }
    ]

    return inquirer.prompt(questions)
  }
}