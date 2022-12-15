import React from 'react'
import PropTypes from 'prop-types'

const Button = ({color,text,onClick, onMouseDown,onMouseUp}) => {

    return (
        <button onClick={onClick} 
        onMouseDown = {onMouseDown}
        onMouseUp = {onMouseUp}
        style = {{backgroundColor:color}}className='btn'>{text}</button>
        
    )
}


Button.defaultProps = {
    color: 'black',
}

Button.propTypes = {
    text:PropTypes.string,
    color:PropTypes.string,
    onClick: PropTypes.func,
}
export default Button