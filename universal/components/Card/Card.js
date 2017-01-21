/* @flow */
import React from 'react'
import { getCardImageSrc } from '../../monopoly/monopoly'
import { BASE_PATH } from '../../config'

type Props = {
  card: ?CardKey,
  faceUp?: boolean,
  highlighted?: boolean,
  onClick: (card: CardKey) => void,
  size: 'large' | 'small' | 'xsmall',
  style?: Object
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
    xsmall: {
      width: 30,
      height: 50
    },
    withBorder: {
      border: '1px solid black'
    },
    highlighted: {
      border: props.highlighted ? '1px solid red' : 'none'
    },
    box: {
      display: 'block'
    }
  }
}

export default class Card extends React.Component {
  props: Props

  static defaultProps = {
    faceUp: false,
    size: 'large',
    onClick: (card: CardKey) => {},
    style: {}
  }

  getImageSrc () {
    if (this.showEmptyPlaceholder()) {
      return
    }

    const { card, faceUp } = this.props
    const src = faceUp && card ? getCardImageSrc(card) : `${BASE_PATH}/images/cards/back.png`
    return src
  }

  showEmptyPlaceholder () {
    const { card, faceUp } = this.props

    return !card && faceUp
  }

  onClick = () => {
    const {
      onClick,
      card
    } = this.props

    card && onClick(card)
  }

  render () {
    const { card, size, style: wrapperStyle } = this.props
    const styles = getStyles(this.props)
    const showEmptyPlaceholder = this.showEmptyPlaceholder()

    return (
      <span style={wrapperStyle}>
        {!showEmptyPlaceholder &&
          <img
            onClick={this.onClick}
            title={card}
            style={{ ...styles[size], ...styles.highlighted }}
            src={this.getImageSrc()}
          />
        }
        {showEmptyPlaceholder &&
          <span
            onClick={this.onClick}
            style={{ ...styles.box, ...styles[size], ...styles.withBorder }}
          />
        }
      </span>
    )
  }
}
