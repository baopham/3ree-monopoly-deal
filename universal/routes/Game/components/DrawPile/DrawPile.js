/* @flow */
import React from 'react'
import { Panel } from 'react-bootstrap'
import CardPile from '../CardPile'

type Props = {
  drawCardsButton: React.Element<*>,
  endTurnButton: React.Element<*>
}

export default class DrawPile extends React.Component {
  props: Props

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
    return (
      <Panel header={this.renderHeader()}>
        <CardPile />
      </Panel>
    )
  }
}
