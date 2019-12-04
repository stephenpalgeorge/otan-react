import React from "react"
import PropTypes from "prop-types"

const Card = ({
    additionalClasses
}) => {
    return (
        <div className={`card ${additionalClasses.join(" ")}`}>

        </div>
    )
}

Card.propTypes = {
    additionalClasses: PropTypes.object
}

Card.defaultProps = {
    additionalClasses: {}
}

export default Card
