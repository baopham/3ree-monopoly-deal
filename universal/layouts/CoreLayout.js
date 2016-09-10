import React, { PropTypes } from 'react'

function CoreLayout ({ children }) {
  return (
    <div>
      {children}
    </div>
  )
}

CoreLayout.propTypes = {
  children: PropTypes.element
}

export default CoreLayout
