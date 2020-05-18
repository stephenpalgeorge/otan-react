const fs = require('fs')
const { transformJSXName, transformMachineName, transformComponentToSassName } = require('../common-utils')

module.exports = {
  renameJSFile: (path, currentName, newName, ext) => {
    try {
      const newPath = `${path}/${transformJSXName(newName)}.${ext}`
      fs.renameSync(`${path}/${transformJSXName(currentName)}.${ext}`, newPath)
      const fileContents = fs.readFileSync(newPath, 'utf-8')
      const jsxRegex = new RegExp(transformJSXName(currentName), 'g')
      const classNameRegex = new RegExp(transformComponentToSassName(currentName), 'g')
      const newContents = fileContents
        .replace(jsxRegex, transformJSXName(newName))
        .replace(classNameRegex, transformComponentToSassName(newName))
      fs.writeFileSync(newPath, newContents, 'utf-8')
    }
    catch (e) { console.error(e) }
  },
  renameSassFile: (path, currentName, newName) => {
    try {
      const newPath = `${path}/_${transformComponentToSassName(newName)}.scss`
      fs.renameSync(`${path}/_${transformComponentToSassName(currentName)}.scss`, newPath)
      const fileContents = fs.readFileSync(newPath, 'utf-8')
      const sassRegex = new RegExp(transformComponentToSassName(currentName), 'g')
      const newContents = fileContents.replace(sassRegex, transformComponentToSassName(newName))
      fs.writeFileSync(newPath, newContents, 'utf-8')
    }
    catch (e) { console.error(e) }
  }
}