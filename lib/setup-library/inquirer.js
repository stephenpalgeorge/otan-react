const inquirer = require('inquirer')
const chalk = require('chalk')
const { getShortDirPath } = require('./utils')
const {
  filterForDirs,
  getShortPath,
  hasSubDirs
} = require('../utils')

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
          choices: ['/', ...filterForDirs(source).map(getShortPath)]
        }
      ]

      return inquirer.prompt(questions)
    }
  },
  // check user wants to create library in current directory
  askConfirmSetup: (currentDir, libName) => {
      const questions = [
          {
              type: 'confirm',
              name: 'confirmSetup',
              message: `We'll create a directory called ${libName} here: ${chalk.blue(getShortDirPath(currentDir))},\nis this correct?`,
              default: true
          }
      ]

      return inquirer.prompt(questions)
  },
  // returns a list of atomic directories that the user wants to create
  askAtomicDirs: () => {
      const questions = [
          {
              type: 'checkbox',
              name: 'atomicDirs',
              message: `\nWhich directories do you want to include in your library?`,
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