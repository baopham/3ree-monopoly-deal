import React, { PropTypes } from 'react'

export default class Card extends React.Component {
  static propTypes = {
    card: PropTypes.string.isRequired
  }

  render () {
    const { card } = this.props

    return (
      <img
        width={100}
        height={150}
        src={`/images/cards/${card}.png`}
      />
    )
  }
}

