import React, { PropTypes } from 'react'
import { Panel } from 'react-bootstrap'
import Member from '../Member'

export default class Members extends React.Component {
  static propTypes = {
    members: PropTypes.array.isRequired
  }

  render () {
    const { members } = this.props

    return (
      <div>
        {members.map(member =>
          <Panel key={member.id} header={`Player: ${member.username}`}>
            <Member member={member} />
          </Panel>
        )}
      </div>
    )
  }
}
