const inquirer = require("inquirer")

const { filterForDirs, getShortPath, hasSubDirs } = require('../utils')

module.exports = {
  // user selects component to remove
  askTargetDir: source => {
    const questions = [
      {
        type: "list",
        name: "targetDir",
        message: "navigate to the component you want to remove",
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
  confirmDelete: (componentName) => {
    const questions = [
      {
        type: "confirm",
        name: "confirmDelete",
        default: false,
        message: `Are you sure you want to delete the ${componentName} component?`
      }
    ]

    return inquirer.prompt(questions)
  }
}