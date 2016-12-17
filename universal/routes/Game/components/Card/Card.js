import React, { PropTypes } from 'react'
import { getCardImageSrc } from '../../../../monopoly/monopoly'

function getStyles (props) {
  return {
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
    },
    highlighted: {
      border: props.highlighted ? '1px solid red' : 'none'
    }
  }
}

export default class Card extends React.Component {
  static propTypes = {
    card: PropTypes.string,
    faceUp: PropTypes.bool,
    highlighted: PropTypes.bool,
    onClick: PropTypes.func,
    size: PropTypes.oneOf(['large', 'small'])
  }

  static defaultProps = {
    faceUp: false,
    size: 'large',
    onClick: () => {}
  }

  getImageSrc () {
    const { card, faceUp } = this.props
    const src = faceUp ? getCardImageSrc(card) : '/images/cards/back.png'
    return src
  }

  onClick = () => {
    const {
      onClick,
      card
    } = this.props

    onClick(card)
  }

  render () {
    const { card, size } = this.props
    const styles = getStyles(this.props)

    return (
      <div>
        {card &&
          <img
            onClick={this.onClick}
            title={card}
            style={{ ...styles[size], ...styles.highlighted }}
            src={this.getImageSrc()}
          />
        }
        {!card &&
          <div
            onClick={this.onClick}
            style={{ ...styles[size], ...styles.withBorder }}
          />
        }
      </div>
    )
  }
}
