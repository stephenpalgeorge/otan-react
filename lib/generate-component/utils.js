const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

const isDir = source => lstatSync(source).isDirectory()

module.exports = {
    transformMachineName: name => {
        return name.toLowerCase().replace(/\s/g, "-")
    },
    transformJSXName: name => {
        const nameArray = name.split(" ")
        return nameArray.map(chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1)).join("")
    },
    filterForDirs: source => {
        return readdirSync(source).map(entry => join(source, entry)).filter(isDir)
    },
    filterForFiles: source => {
        return readdirSync(source).map(entry => join(source, entry)).filter(!isDir)
    },
    getShortPath: path => {
        const pathArray = path.split("/")
        return pathArray[pathArray.length - 1]
    },
    hasSubDirs: source => {
        return readdirSync(source).map(entry => join(source, entry)).filter(isDir).length > 0
    }
}