const { existsSync, lstatSync, readdirSync } = require('fs')
const { join } = require('path')

const isDir = source => lstatSync(source).isDirectory()

module.exports = {
  hasArg: (argName, args) => {
    let longName = `--${argName}`
    let shortName = `-${argName.charAt(0)}`
    if (!Array.isArray(args)) {
      console.error("args is not an array")
      return
    }
    else {
      if (args.indexOf(longName) >= 0) {
        return {
          index: args.indexOf(longName),
          value: args[args.indexOf(longName) + 1]
        }
      }
      else if (args.indexOf(shortName) >= 0) {
        return {
          index: args.indexOf(shortName),
          value: args[args.indexOf(shortName) + 1]
        }
      }
      else {
        return {
          index: -1,
          value: null
        }
      }
    }
  },
  useConfig: () => {
    const defaultConfig = require('../defaults.config.js')
    const localConfig = existsSync(`${process.cwd()}/loris.config.js`) ? require(`${process.cwd()}/loris.config.js`) : {}

    return Object.assign(defaultConfig, localConfig)
  },
  // reads the contents of a directory and returns an array of directories therein,
  // @depends on isDir()
  filterForDirs: source => {
    return readdirSync(source).map(entry => join(source, entry)).filter(isDir)
  },
  // returns the final section of a file path, e.g.
  // User/myusername/documents/dev -> dev
  getShortPath: path => {
    const pathArray = path.split("/")
    return pathArray[pathArray.length - 1]
  },
  // returns a boolean, true if source dir has directories within
  // @depends on isDir()
  hasSubDirs: source => {
    return readdirSync(source).map(entry => join(source, entry)).filter(isDir).length > 0
  }
}