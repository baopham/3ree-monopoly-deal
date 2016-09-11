import React, { PropTypes } from 'react'

export default class JoinForm extends React.Component {
  static propTypes = {
    onJoin: PropTypes.func.isRequired
  }

  componentDidMount () {
    const username = window.prompt('Enter a username to join this game')
    this.props.onJoin(username)
  }

  render () {
    return (
      <div></div>
    )
  }
}

