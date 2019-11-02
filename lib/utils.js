module.exports = {
    transformComponentName: name => {
        return name.toLowerCase().replace(" ", "-")
    },
    transformJSXName: name => {
        const nameArray = name.split("-")
        if (nameArray.length === 1) return nameArray[0].charAt(0).toUpperCase() + nameArray[0].slice(1)
        else {
            return nameArray.map((chunk, i) => {
                if (i > 0) return chunk.charAt(0).toUpperCase() + chunk.slice(1)
                else return chunk
            }).join("")
        }
    }
}