module.exports = {
  // returns a shortened path name of the last 3 segments, e.g.
  // /documents/dev/loris-react/library/01-atoms -> loris-react/library/01-atoms
  getShortDirPath: dirPath => {
      const pathArray = dirPath.split('/')
      return pathArray.slice(pathArray.length -3).join("/")
  }
}