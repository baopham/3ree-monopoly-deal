import React, { PropTypes } from 'react'
import Cards from './Cards'

export default class Board extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired
  }

  render () {
    const { cards } = this.props.game

    return (
      <div>
        <Cards cards={cards} />
      </div>
    )
  }
}

