const { existsSync, lstatSync, readdirSync } = require('fs')
const { join } = require('path')

const isDir = source => lstatSync(source).isDirectory()
const useConfig = () => {
  const defaultConfig = require('../defaults.config.js')
  const localConfig = existsSync(`${process.cwd()}/otan.config.js`) ? require(`${process.cwd()}/otan.config.js`) : {}

  return Object.assign(defaultConfig, localConfig)
}

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
  useConfig: useConfig,
  // reads the contents of a directory and returns an array of directories therein,
  // @depends on isDir()
  filterForDirs: source => {
    return readdirSync(source).map(entry => join(source, entry)).filter(isDir)
  },
  getPathToAtomicDir: dest => {
    const partials = dest.split('/')
    const { dirnames } = useConfig()
    let atomicIndex = ""
    dirnames.forEach(dirname => {
      if (partials.indexOf(dirname) >= 0) atomicIndex = partials.indexOf(dirname)
    })
    return partials.slice(0, atomicIndex + 1).join('/')
  },
  getPathToLib: (dest, libName) => {
    const partials = dest.split('/')
    const libIndex = partials.indexOf(libName)
    if (libIndex >= 0) return partials.slice(0, libIndex + 1).join('/')
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
  },
  isAtomicDir: (dirname) => {
    const atomicDirNames = useConfig().dirnames
    return atomicDirNames.indexOf(dirname) >= 0
  },
  // takes a Pascal Case string and returns a lower case, hyphenated string, e.g.
  // ComponentName -> component-name
  transformComponentToSassName: componentName => {
    return componentName.split(/(?=[A-Z])/g).join("-").toLowerCase()
  }
}