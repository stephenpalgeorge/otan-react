module.exports = {
    transformComponentName: name => {
        return name.toLowerCase().replace(" ", "-")
    },
    transformJSXName: name => {
        const nameArray = name.split("-")
        return nameArray.map(chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1)).join("")
    }
}