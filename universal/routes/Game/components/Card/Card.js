/* @flow */
import React from 'react'
import { getCardImageSrc } from '../../../../monopoly/monopoly'

type Props = {
  card: ?CardKey,
  faceUp?: boolean,
  highlighted?: boolean,
  onClick: (card: CardKey) => void,
  size: 'large' | 'small'
}

function getStyles (props: Props) {
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
  props: Props

  static defaultProps = {
    faceUp: false,
    size: 'large',
    onClick: (card: CardKey) => {}
  }

  getImageSrc () {
    const { card, faceUp } = this.props
    if (!card) {
      return
    }

    const src = faceUp ? getCardImageSrc(card) : '/images/cards/back.png'
    return src
  }

  onClick = () => {
    const {
      onClick,
      card
    } = this.props

    card && onClick(card)
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
