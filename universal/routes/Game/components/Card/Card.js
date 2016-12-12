import React, { PropTypes } from 'react'
import { getCardImageSrc } from '../../../../monopoly/monopoly'

const styles = {
  large: {
    width: 150,
    height: 230
  },
  small: {
    width: 90,
    height: 140
  },
  withBorder: {
    border: '1px solid black'
  }
}

export default class Card extends React.Component {
  static propTypes = {
    card: PropTypes.string,
    faceUp: PropTypes.bool,
    size: PropTypes.oneOf(['large', 'small'])
  }

  static defaultProps = {
    faceUp: false,
    size: 'large'
  }

  getImageSrc () {
    const { card, faceUp } = this.props
    const src = faceUp ? getCardImageSrc(card) : '/images/cards/back.png'
    return src
  }

  render () {
    const { card, size } = this.props

    return (
      <div>
        {card &&
          <img
            title={card}
            style={styles[size]}
            src={this.getImageSrc()}
          />
        }
        {!card &&
          <div style={{ ...styles[size], ...styles.withBorder }} />
        }
      </div>
    )
  }
}

