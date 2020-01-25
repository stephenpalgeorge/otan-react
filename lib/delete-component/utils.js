const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

module.exports = {
  deleteDir: url => {
    try {
      fs.readdirSync(url).forEach(item => {
        let absPath = path.join(url, item)
        fs.unlinkSync(absPath)
      })
      fs.rmdirSync(url)
    }
    catch (err) {
      console.error(
        chalk.red(
  `error deleting compenent:
  ${err}`
        )
      )
    }
  }
}