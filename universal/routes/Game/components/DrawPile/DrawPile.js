import React, { PropTypes } from 'react'
import { Panel } from 'react-bootstrap'
import CardPile from '../CardPile'

export default class DrawPile extends React.Component {
  static propTypes = {
    cards: PropTypes.array
  }

  static defaultProps = {
    cards: []
  }

  render () {
    return (
      <Panel header="Draw Pile">
        <CardPile cards={this.props.cards} />
      </Panel>
    )
  }
}

