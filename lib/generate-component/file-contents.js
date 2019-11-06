const componentJsFile = (machineName, jsxName) => {
    return (
`import React from "react"
import PropTypes from "prop-types"

const ${jsxName} = ({
    additionalClasses
}) => {
    return (
        <div className={\`${machineName}\ $\{additionalClasses.join(" ")}\`}>

        </div>
    )
}

${jsxName}.propTypes = {
    additionalClasses: PropTypes.object
}

export default ${jsxName}
`
    )
}

const componentSassFile = machineName => {
    return (
`.${machineName} {

}
`
    )
}

module.exports = {
    componentJsFile,
    componentSassFile
}