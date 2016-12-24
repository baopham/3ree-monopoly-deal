/* @flow */
import React from 'react'
import type PropertySetClass from '../../../../monopoly/PropertySet'
import PropertySet from '../PropertySet'
import { hasEnoughFullSetsToWin, groupPropertiesIntoSets } from '../../../../monopoly/monopoly'

type Props = {
  properties: CardKey[],
  onCardClick?: (card: CardKey, index: number) => void,
  isCardHighlighted: (card: CardKey, index: number) => boolean,
  onWinning: () => void
}

export default class Properties extends React.Component {
  props: Props

  propertySets: PropertySetClass[]

  hasWon: boolean

  static defaultProps = {
    isCardHighlighted: (card: CardKey, index: number) => false,
    onWinning: () => {}
  }

  constructor (props: Props) {
    super(props)

    this.propertySets = groupPropertiesIntoSets(this.props.properties)
    this.hasWon = hasEnoughFullSetsToWin(this.propertySets)
    this.hasWon && this.props.onWinning()
  }

  shouldComponentUpdate () {
    return !this.hasWon
  }

  componentWillUpdate (nextProps: Props) {
    this.propertySets = groupPropertiesIntoSets(nextProps.properties)
    this.hasWon = hasEnoughFullSetsToWin(this.propertySets)
    this.hasWon && this.props.onWinning()
  }

  componentWillUnmount () {
    this.propertySets = []
    this.hasWon = false
  }

  render () {
    const {
      onCardClick,
      isCardHighlighted
    } = this.props

    return (
      <ul className='list-inline'>
        {this.propertySets.map((set, i) =>
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
