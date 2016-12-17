import React, { PropTypes } from 'react'
import { Panel } from 'react-bootstrap'
import CardPile from '../CardPile'

export default class DiscardPile extends React.Component {
  static propTypes = {
    lastCardPlayedBy: PropTypes.string,
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
    const { cards, lastCardPlayedBy } = this.props

    return (
      <Panel header={this.renderHeader()}>
        {lastCardPlayedBy &&
          <p>
            <strong>{lastCardPlayedBy}</strong> played:
          </p>
        }
        <CardPile cards={cards} faceUp />
      </Panel>
    )
  }
}
