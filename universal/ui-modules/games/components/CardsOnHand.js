import React, { PropTypes } from 'react'

export default class CardsOnHand extends React.Component {
  static propTypes = {
    member: PropTypes.object.isRequired
  }

  render () {
    return (
      <div>
        Cards on hand...
      </div>
    )
  }
}

