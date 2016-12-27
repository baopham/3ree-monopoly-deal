/* @flow */
import React from 'react'
import { Panel } from 'react-bootstrap'
import CardPile from '../CardPile'

type Props = {
  cards: CardKey[],
  drawCardsButton: React.Element<*>,
  endTurnButton: React.Element<*>
}

export default class DrawPile extends React.Component {
  props: Props

  static defaultProps = {
    cards: []
  }

  renderHeader () {
    const { drawCardsButton, endTurnButton } = this.props

    return (
      <div>
        Draw Pile
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
