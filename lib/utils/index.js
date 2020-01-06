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
  }
}