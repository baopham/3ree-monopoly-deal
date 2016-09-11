import React, { PropTypes } from 'react'
import CardPile from './CardPile'

export default class DrawPile extends React.Component {
  static propTypes = {
    cards: PropTypes.array
  }

  static defaultProps = {
    cards: []
  }

  render () {
    return (
      <div>
        <div style={{border: '1px solid black', width: 150, height: 250}}>
          <strong>Draw Pile</strong>
          <CardPile cards={this.props.cards} />
        </div>
      </div>
    )
  }
}

