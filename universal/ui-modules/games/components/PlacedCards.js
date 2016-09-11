import React, { PropTypes } from 'react'
import Card from './Card'

export default class PlacedCards extends React.Component {
  static propTypes = {
    member: PropTypes.object.isRequired
  }

  render () {
    const { member } = this.props

    return (
      <div>
        <h3>{member.username}</h3>

        <h4>Bank</h4>
        {member.placedCards.bank.map((card, i) =>
          <Card card={card} key={i} />
        )}

        <h4>Properties</h4>
        {member.placedCards.properties.map((card, i) =>
          <Card card={card} key={i} />
        )}
      </div>
    )
  }
}

