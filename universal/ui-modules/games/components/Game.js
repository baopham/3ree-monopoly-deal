import React, { PropTypes } from 'react'
import Members from './Members'

export default class Game extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired
  }

  render () {
    const { game } = this.props

    return (
      <div>
        <Members members={game.members} />
      </div>
    )
  }
}
