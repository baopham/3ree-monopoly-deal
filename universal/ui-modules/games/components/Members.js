import React, { PropTypes } from 'react'

export default class Members extends React.Component {
  static propTypes = {
    members: PropTypes.array.isRequired
  }

  render () {
    const { members } = this.props

    return (
      <ul>
        {members.map((member, i) =>
          <li key={i}>
            {member.name}
          </li>
        )}
      </ul>
    )
  }
}

