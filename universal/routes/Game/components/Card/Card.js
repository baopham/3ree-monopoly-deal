import React, { PropTypes } from 'react'
import { CARDS } from '../../../../monopoly/cards'

const styles = {
  large: {
    width: 150,
    height: 230
  },
  small: {
    width: 90,
    height: 140
  }
}

export default class Card extends React.Component {
  static propTypes = {
    card: PropTypes.string.isRequired,
    faceUp: PropTypes.bool,
    size: PropTypes.oneOf(['large', 'small'])
  }

  static defaultProps = {
    faceUp: false,
    size: 'large'
  }

  render () {
    const { card, faceUp, size } = this.props
    const src = faceUp ? CARDS[card].image : '/images/cards/back.png'

    return (
      <img
        style={styles[size]}
        src={src}
      />
    )
  }
}

