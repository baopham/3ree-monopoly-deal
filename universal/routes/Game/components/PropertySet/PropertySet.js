/* @flow */
import React from 'react'
import Card from '../../../../components/Card'
import PropertySetClass from '../../../../monopoly/PropertySet'
import { Panel } from 'react-bootstrap'

type Props = {
  propertySet: PropertySetClass,
  renderCardFooter: (card: CardKey) => React$Element<*>,
  onCardClick: (card: CardKey, index: number) => void,
  isCardHighlighted: (card: CardKey, index: number) => boolean
}

const styles = {
  card: {
    display: 'block'
  }
}

export default class PropertySet extends React.Component {
  props: Props

  static defaultProps = {
    renderCardFooter: (card: CardKey) => <div />,
    onCardClick: (card: CardKey, index: number) => {},
    isCardHighlighted: (card: CardKey, index: number) => false
  }

  render () {
    const {
      propertySet,
      isCardHighlighted,
      onCardClick,
      renderCardFooter
    } = this.props
    const bsStyle = propertySet.isFullSet() ? 'primary' : 'default'

    return (
      <Panel bsStyle={bsStyle}>
        <ul className='list-inline'>
          {propertySet.getCards().map((card, i) =>
            <li key={i}>
              <Card
                style={styles.card}
                highlighted={isCardHighlighted(card, i)}
                onClick={(card) => onCardClick(card, i)}
                card={card}
                size='small'
                faceUp
              />
              <div className='pull-left'>
                {renderCardFooter(card)}
              </div>
            </li>
          )}
        </ul>
      </Panel>
    )
  }
}
