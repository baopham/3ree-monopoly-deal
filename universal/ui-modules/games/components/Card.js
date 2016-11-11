import React, { PropTypes } from 'react'
import { CARD_TYPES } from '../../../monopoly/cards'

export default class Card extends React.Component {
  static propTypes = {
    card: PropTypes.string.isRequired,
    faceUp: PropTypes.bool
  }

  static defaultProps = {
    faceUp: false
  }

  render () {
    const { card, faceUp } = this.props
    const src = faceUp ? CARD_TYPES[card].image : '/images/cards/back.png'

    return (
      <img
        width='100%'
        height='100%'
        src={src}
      />
    )
  }
}

