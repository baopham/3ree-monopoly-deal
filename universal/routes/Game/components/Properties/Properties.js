/* @flow */
import React from 'react'
import type PropertySetType from '../../../../monopoly/PropertySet'
import PropertySet from '../PropertySet'
import * as monopoly from '../../../../monopoly/monopoly'

type Props = {
  propertySets: PropertySetType[],
  onCardClick: (card: CardKey, index: number, serializedPropertySetIndex: number) => void,
  isCardHighlighted: (card: CardKey, index: number, serializedPropertySetIndex: number) => boolean,
  onWinning: () => void
}

export default class Properties extends React.Component {
  props: Props

  hasWon: boolean

  static defaultProps = {
    isCardHighlighted: (card: CardKey, index: number, serializedPropertySetIndex: number) => false,
    onCardClick: (card: CardKey, index: number, serializedPropertySetIndex: number) => {},
    onWinning: () => {}
  }

  constructor (props: Props) {
    super(props)

    this.hasWon = monopoly.hasEnoughFullSetsToWin(props.propertySets)
    this.hasWon && this.props.onWinning()
  }

  shouldComponentUpdate () {
    return !this.hasWon
  }

  componentWillUpdate (nextProps: Props) {
    this.hasWon = monopoly.hasEnoughFullSetsToWin(nextProps.propertySets)
    this.hasWon && this.props.onWinning()
  }

  componentWillUnmount () {
    this.hasWon = false
  }

  render () {
    const {
      propertySets,
      onCardClick,
      isCardHighlighted
    } = this.props

    return (
      <ul className='list-inline'>
        {propertySets.map((set, setIndex) =>
          <li key={setIndex}>
            <PropertySet
              onCardClick={(card, cardIndex) => onCardClick(card, cardIndex, setIndex)}
              isCardHighlighted={(card, cardIndex) => isCardHighlighted(card, cardIndex, setIndex)}
              propertySet={set}
            />
          </li>
        )}
      </ul>
    )
  }
}
