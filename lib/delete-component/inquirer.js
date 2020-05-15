const inquirer = require("inquirer")

module.exports = {
  confirmDelete: componentName => {
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