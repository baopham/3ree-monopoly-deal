import React, { PropTypes } from 'react'
import PropertySet from '../PropertySet'
import { hasEnoughFullSetsToWin, groupPropertiesIntoSets } from '../../../../monopoly/monopoly'

export default class Properties extends React.Component {
  static propTypes = {
    properties: PropTypes.arrayOf(PropTypes.string).isRequired,
    onCardClick: PropTypes.func,
    isCardHighlighted: PropTypes.func,
    onWinning: PropTypes.func
  }

  static defaultProps = {
    isCardHighlighted: () => {},
    onWinning: () => {}
  }

  constructor (...args) {
    super(...args)

    this.propertySets = groupPropertiesIntoSets(this.props.properties)
    this.hasWon = hasEnoughFullSetsToWin(this.propertySets)
    this.hasWon && this.props.onWinning()
  }

  shouldComponentUpdate () {
    return !this.hasWon
  }

  componentWillUpdate (nextProps) {
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
