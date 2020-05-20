const inquirer = require('inquirer')
const { filterForDirs, getShortPath, hasSubDirs, useConfig } = require('../common-utils')

const { ignore } = useConfig()
module.exports = {
  askTargetDir: (source, message) => {
    const questions = [
      {
        type: "list",
        name: "targetDir",
        message: message,
        choices: ['./', ...filterForDirs(source).map(getShortPath).filter(dir => !ignore.includes(dir))]
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
          choices: ['./', ...filterForDirs(source).map(getShortPath).filter(dir => !ignore.includes(dir))]
        }
      ]

      return inquirer.prompt(questions)
    }
  }
}