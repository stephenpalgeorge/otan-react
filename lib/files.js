const fs = require('fs')
const chalk = require('chalk')

const { transformJSXName } = require('./utils')

module.exports = {
    /**
     * CREATE COMPONENT JS FILE
     */
    writeJSFile: (componentName, targetDir) => {
        const jsxName = transformJSXName(componentName)

        const fileContents = 
`import React from "react"
import PropTypes from "prop-types"

const ${jsxName} = ({
    additionalClasses
}) => {
    return (
        <div className={\`${componentName}\ $\{additionalClasses.join(" ")}\`}>

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
                console.log(
                    chalk.green(`created file: ${targetDir}/${componentName}.js`)
                )
            }
        })
    },
    /**
     * CREATE COMPONENT SASS FILE
     */
    writeSassFile: (componentName, targetDir) => {
        const fileContents =
`.${componentName} {

}
`
        fs.writeFile(`${targetDir}/_${componentName}.scss`, fileContents, err => {
            if (err) console.error(err)
            else {
                console.log(
                    chalk.green(`created file: ${targetDir}/_${componentName}.scss`)
                )
            }
        })
    },
    /**
     * CREATE DEFAULT PROPS FILE
     */
    writeDefaultsFile: (componentName, targetDir) => {
        const jsxName = transformJSXName(componentName)
        const fileContents =
`const defaults = {
    additionalClasses: {
        value: []
    }
}

export default defaults
`
        // write defaults.js to component dir
        fs.writeFile(`${targetDir}/defaults.js`, fileContents, err => {
            if (err) console.error(err)
            else {
                console.log(
                    chalk.green(`created file: ${targetDir}/defaults.js`)
                )
            }
        })

        // text to be included in imports section of component js file
        const jsAdditionalImport =
`
import defaults from "./defaults"
`
        // text to be included in props section of component js file
        const jsDefaultProps =
`
\n${jsxName}.defaultProps = {
    additionalClasses: defaults.additionalClasses.value
}
`
        // insert defaults import & defaultProps into main component js file
        fs.readFile(`${targetDir}/${componentName}.js`, 'utf8', (err, data) => {
            if (err) console.error(err)

            // split file contents at points of inclusion
            const dataChunks = data.split("\"prop-types\"")
            const propTypesText = dataChunks[1].split('object\n}')

            // reconstruct file with new text interpolated
            const newJsContents = [
                dataChunks[0],
                "\"prop-types\"",
                jsAdditionalImport,
                propTypesText[0],
                'object\n}',
                jsDefaultProps,
                propTypesText[1]
            ].join("")

            // rewrite component js file wiith new contents
            fs.writeFile(`${targetDir}/${componentName}.js`, newJsContents, err => {
                if (err) console.error(err)
                else {
                    console.log(
                        chalk.green(`updated file: ${targetDir}/${componentName}.js`)
                    )
                }
            })
        })
    }
}