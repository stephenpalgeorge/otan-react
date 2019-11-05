module.exports = {
    getShortDirPath: dirPath => {
        const pathArray = dirPath.split('/')
        return pathArray.slice(pathArray.length -3).join("/")
    }
}