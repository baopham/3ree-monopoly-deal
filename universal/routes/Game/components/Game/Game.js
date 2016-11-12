import React, { PropTypes } from 'react'
import FullWidth from '../../../../components/FullWidth'
import JoinForm from '../JoinForm'
import CardsOnHand from '../CardsOnHand'
import Board from '../../components/Board'

export default class Game extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    player: PropTypes.object,
    onJoin: PropTypes.func.isRequired
  }

  render () {
    const { game, player, onJoin} = this.props

    return (
      <FullWidth fluid>
        <h2>Game: {game.name}</h2>
        <Board game={game} />

        {!player &&
          <JoinForm onJoin={onJoin} />
        }
        {player &&
          <CardsOnHand member={player} />
        }
      </FullWidth>
    )
  }
}
