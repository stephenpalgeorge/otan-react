import React from "react"
import PropTypes from "prop-types"

const Button = ({
    additionalClasses
}) => {
    return (
        <div className={`button ${additionalClasses.join(" ")}`}>

        </div>
    )
}

Button.propTypes = {
    additionalClasses: PropTypes.object
}

Button.defaultProps = {
    additionalClasses: {}
}

export default Button
