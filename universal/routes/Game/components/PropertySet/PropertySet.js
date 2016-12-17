import React, { PropTypes } from 'react'
import Card from '../Card'
import PropertySetClass from '../../../../monopoly/PropertySet'
import { Panel } from 'react-bootstrap'

export default class PropertySet extends React.Component {
  static propTypes = {
    propertySet: PropTypes.instanceOf(PropertySetClass).isRequired,
    onCardClick: PropTypes.func,
    isCardHighlighted: PropTypes.func
  }

  render () {
    const {
      propertySet,
      isCardHighlighted,
      onCardClick
    } = this.props
    const bsStyle = propertySet.isFullSet() ? 'primary' : 'default'

    return (
      <Panel bsStyle={bsStyle}>
        <ul className='list-inline'>
          {propertySet.getProperties().map((property, i) =>
            <li key={i}>
              <Card
                highlighted={isCardHighlighted(property, i)}
                onClick={(card) => onCardClick(card, i)}
                card={property}
                size='small'
                faceUp
              />
            </li>
          )}
        </ul>
      </Panel>
    )
  }
}
