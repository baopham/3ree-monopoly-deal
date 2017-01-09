/* @flow */
import React from 'react'
import { Panel } from 'react-bootstrap'
import PropertySet from '../PropertySet'
import PropertySetClass from '../../../../monopoly/PropertySet'

type Props = {
  players: Player[],
  onCardSelect: (player: Player, setIndex: number, cardIndex: number) => void,
  onCardUnselect: () => void,
  playerPropertySetFilter: (propertySet: PropertySetClass) => boolean
}

type State = {
  player: Player,
  setIndex: number,
  selectedCardIndex: number
}

export default class MultiplePlayerPropertyCardSelector extends React.Component {
  props: Props

  state: State

  state = {
    player: undefined,
    setIndex: undefined,
    selectedCardIndex: undefined
  }

  onCardClick = (player: Player, setIndex: number, selectedCardIndex: number) => {
    if (this.isCardHighlighted(player, setIndex, selectedCardIndex)) {
      this.setState({
        player: undefined,
        setIndex: undefined,
        selectedCardIndex: undefined
      })
      this.props.onCardUnselect()
      return
    }

    this.setState({
      player,
      setIndex,
      selectedCardIndex
    })

    this.props.onCardSelect(player, setIndex, selectedCardIndex)
  }

  isCardHighlighted = (player: Player, setIndex: number, selectedCardIndex: number): boolean => {
    return !!this.state.player &&
    this.state.player.id === player.id &&
    this.state.setIndex === setIndex &&
    this.state.selectedCardIndex === selectedCardIndex
  }

  renderPlayerPropertySets = (player: Player) => {
    const { playerPropertySetFilter } = this.props
    const propertySets = player.placedCards.serializedPropertySets
      .map(PropertySetClass.unserialize)

    return (
      <ul className='list-inline'>
        {propertySets.map((set, setIndex) =>
          <li key={`${player.id}-${setIndex}`}>
            {playerPropertySetFilter(set) &&
              <PropertySet
                propertySet={set}
                onCardClick={(card, cardIndex) => this.onCardClick(player, setIndex, cardIndex)}
                isCardHighlighted={(card, cardIndex) => this.isCardHighlighted(player, setIndex, cardIndex)}
              />
            }
          </li>
        )}
      </ul>
    )
  }

  render () {
    const { players } = this.props

    return (
      <div>
        {players.map(player =>
          <Panel key={player.id} header={<div>Player: {player.username}</div>}>
            {this.renderPlayerPropertySets(player)}
          </Panel>
        )}
      </div>
    )
  }
}
