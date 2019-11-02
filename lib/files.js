const fs = require('fs')
const chalk = require('chalk')

const { transformJSXName } = require('./utils')

module.exports = {
    writeJSFile: (componentName, targetDir) => {
        const jsxName = transformJSXName(componentName)

        const fileContents = 
`import React from "react"
import PropTypes from "prop-types"

const ${jsxName} = ({
    additionalClasses
}) => {
    return (
        <div className={[\`${componentName}\ $\{additionalClasses.join(" ")}\`]}>

        </div>
    )
}

${jsxName}.propTypes = {
    additionalClasses: PropTypes.object
}

export default ${jsxName}
`

        fs.writeFile(`${targetDir}/${componentName}.js`, fileContents, err => {
            if (err) console.error(err)
            else {
                console.log(chalk.green(`created file: ${targetDir}/${componentName}.js`))
            }
        })
    }
}