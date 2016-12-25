/* @flow */
import React from 'react'
import type PropertySetClass from '../../../../monopoly/PropertySet'
import PropertySet from '../PropertySet'
import * as monopoly from '../../../../monopoly/monopoly'

type Props = {
  propertySets: PropertySetClass[],
  onCardClick?: (card: CardKey, index: number) => void,
  isCardHighlighted: (card: CardKey, index: number) => boolean,
  onWinning: () => void
}

export default class Properties extends React.Component {
  props: Props

  hasWon: boolean

  static defaultProps = {
    isCardHighlighted: (card: CardKey, index: number) => false,
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
        {propertySets.map((set, i) =>
          <li key={i}>
            <PropertySet
              onCardClick={onCardClick}
              isCardHighlighted={isCardHighlighted}
              propertySet={set}
            />
          </li>
        )}
      </ul>
    )
  }
}
