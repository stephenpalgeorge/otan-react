const fs = require('fs')
const path = require('path')

module.exports = {
  deleteDir: path => {
    try {
      fs.readdirSync(path).forEach(item => {
        let absPath = path.join(path, item)
        fs.unlinkSync(absPath)
      })
      fs.rmdirSync(path)
    }
    catch (err) {
      console.error(`error deleting compenent: ${err}`)
    }
  }
}