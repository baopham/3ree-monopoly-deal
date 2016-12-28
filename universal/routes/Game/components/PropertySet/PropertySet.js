/* @flow */
import React from 'react'
import Card from '../Card'
import PropertySetClass from '../../../../monopoly/PropertySet'
import { Panel } from 'react-bootstrap'

type Props = {
  propertySet: PropertySetClass,
  onCardClick: (card: CardKey, index: number) => void,
  isCardHighlighted: (card: CardKey, index: number) => boolean,
  fullSetOnly: boolean
}

export default class PropertySet extends React.Component {
  props: Props

  static defaultProps = {
    onCardClick: (card: CardKey, index: number) => {},
    isCardHighlighted: (card: CardKey, index: number) => false,
    fullSetOnly: false
  }

  renderPropertySet () {
    const {
      propertySet,
      isCardHighlighted,
      onCardClick
    } = this.props

    return (
      propertySet.getCards().map((card, i) =>
        <li key={i}>
          <Card
            highlighted={isCardHighlighted(card, i)}
            onClick={(card) => onCardClick(card, i)}
            card={card}
            size='small'
            faceUp
          />
        </li>
      )
    )
  }

  render () {
    const {
      propertySet,
      fullSetOnly
    } = this.props
    const fullSet = propertySet.isFullSet()
    const bsStyle = fullSet ? 'primary' : 'default'

    return (
      <Panel bsStyle={bsStyle}>
        <ul className='list-inline'>
          {fullSetOnly && fullSet &&
            this.renderPropertySet(propertySet)
          }
          {!fullSetOnly &&
            this.renderPropertySet(propertySet)
          }
        </ul>
      </Panel>
    )
  }
}
