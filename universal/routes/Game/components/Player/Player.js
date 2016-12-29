/* @flow */
import React from 'react'
import PlacedCards from '../PlacedCards'
import ActionCounter from '../ActionCounter'
import { Panel } from 'react-bootstrap'

type Props = {
  player: Player,
  isCurrentPlayer: boolean,
  onWinning: (username: Username) => void
}

export default class PlayerComponent extends React.Component {
  props: Props

  onWinning = () => {
    this.props.onWinning(this.props.player.username)
  }

  renderHeader () {
    const { player } = this.props

    return (
      <div>
        Player: {player.username}
        <ActionCounter
          className='pull-right'
          count={player.actionCounter}
        />
      </div>
    )
  }

  render () {
    const { player, isCurrentPlayer } = this.props

    return (
      <Panel
        header={this.renderHeader()}
        bsStyle={isCurrentPlayer ? 'success' : 'default'}
      >
        <PlacedCards
          cards={player.placedCards}
          onWinning={this.onWinning}
        />
      </Panel>
    )
  }
}
