import React, { PropTypes } from 'react'
import { Panel } from 'react-bootstrap'
import CardPile from '../CardPile'

export default class DiscardPile extends React.Component {
  static propTypes = {
    cards: PropTypes.array
  }

  static defaultProps = {
    cards: []
  }

  renderHeader () {
    return (
      <div>
        Discard Pile
      </div>
    )
  }

  render () {
    return (
      <Panel header={this.renderHeader()}>
        <CardPile cards={this.props.cards} faceUp />
      </Panel>
    )
  }
}

