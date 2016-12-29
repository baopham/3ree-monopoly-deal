/* @flow */
import React from 'react'
import { Panel } from 'react-bootstrap'
import CardPile from '../CardPile'

type Props = {
  lastCardPlayedBy: Username,
  cards: CardKey[]
}

export default class DiscardPile extends React.Component {
  props: Props

  static defaultProps = {
    cards: []
  }

  render () {
    const { cards, lastCardPlayedBy } = this.props

    return (
      <Panel header={<span>Discard Pile</span>}>
        {lastCardPlayedBy &&
          <p>
            <strong>{lastCardPlayedBy}</strong> played:
          </p>
        }
        <CardPile cards={cards} faceUp />
      </Panel>
    )
  }
}
