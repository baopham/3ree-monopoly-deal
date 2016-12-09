import React, { PropTypes } from 'react'
import { Panel } from 'react-bootstrap'
import CardPile from '../CardPile'

export default class DrawPile extends React.Component {
  static propTypes = {
    cards: PropTypes.array,
    drawCardsButton: PropTypes.node,
    endTurnButton: PropTypes.node
  }

  static defaultProps = {
    cards: []
  }

  renderHeader () {
    const { drawCardsButton, endTurnButton } = this.props

    return (
      <div>
        Draw Piles
        <div className='pull-right'>
          {endTurnButton}
          {drawCardsButton}
        </div>
      </div>
    )
  }

  render () {
    const { cards } = this.props

    return (
      <Panel header={this.renderHeader()}>
        <CardPile cards={cards} />
      </Panel>
    )
  }
}

