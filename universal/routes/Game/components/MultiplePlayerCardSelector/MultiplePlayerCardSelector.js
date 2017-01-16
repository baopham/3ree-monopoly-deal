/* @flow */
import React from 'react'
import { Panel } from 'react-bootstrap'
import Card from '../Card'
import PropertySet from '../PropertySet'
import PropertySetClass from '../../../../monopoly/PropertySet'

const SET_CARD = 'set'
const LEFT_OVER_CARD = 'leftOverCard'

type Props = {
  players: Player[],
  onSetCardSelect: (player: Player, setIndex: number, cardIndex: number) => void,
  onLeftOverCardSelect: (player: Player, cardIndex: number) => void,
  onCardUnselect: () => void,
  playerPropertySetFilter: (propertySet: PropertySetClass) => boolean
}

type CardType = 'set' | 'leftOverCard'

type State = {
  player: Player,
  setIndex: number,
  cardType: CardType,
  selectedCardIndex: number
}

export default class MultiplePlayerCardSelector extends React.Component {
  props: Props

  state: State

  state = {
    player: undefined,
    setIndex: undefined,
    cardType: undefined,
    selectedCardIndex: undefined
  }

  onSetCardClick = (player: Player, setIndex: number, selectedCardIndex: number) => {
    const cardType = SET_CARD
    if (this.isCardHighlighted(player, setIndex, cardType, selectedCardIndex)) {
      this.setState({
        player: undefined,
        setIndex: undefined,
        cardType: undefined,
        selectedCardIndex: undefined
      })
      this.props.onCardUnselect()
      return
    }

    this.setState({
      player,
      setIndex,
      cardType,
      selectedCardIndex
    })

    this.props.onSetCardSelect(player, setIndex, selectedCardIndex)
  }

  onLeftOverCardClick = (player: Player, selectedCardIndex: number) => {
    const cardType = LEFT_OVER_CARD
    if (this.isCardHighlighted(player, undefined, cardType, selectedCardIndex)) {
      this.setState({
        player: undefined,
        setIndex: undefined,
        cardType: undefined,
        selectedCardIndex: undefined
      })
      this.props.onCardUnselect()
      return
    }

    this.setState({
      player,
      setIndex: undefined,
      cardType,
      selectedCardIndex
    })

    this.props.onLeftOverCardSelect(player, selectedCardIndex)
  }

  isCardHighlighted = (player: Player, setIndex: ?number, cardType: CardType, selectedCardIndex: number): boolean => {
    return !!this.state.player &&
    this.state.player.id === player.id &&
    this.state.setIndex === setIndex &&
    this.state.cardType === cardType &&
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
                onCardClick={(card, cardIndex) => this.onSetCardClick(player, setIndex, cardIndex)}
                isCardHighlighted={(card, cardIndex) => this.isCardHighlighted(player, setIndex, SET_CARD, cardIndex)}
              />
            }
          </li>
        )}
      </ul>
    )
  }

  renderLeftOverCards = (player: Player) => {
    const { placedCards: { leftOverCards } } = player

    return (
      <ul className='list-inline'>
        {leftOverCards.map((card, cardIndex) =>
          <li key={cardIndex}>
            <Card
              highlighted={this.isCardHighlighted(player, undefined, LEFT_OVER_CARD, cardIndex)}
              onClick={() => this.onLeftOverCardClick(player, cardIndex)}
              card={card}
              size='small'
              faceUp
            />
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
            {this.renderLeftOverCards(player)}
          </Panel>
        )}
      </div>
    )
  }
}
