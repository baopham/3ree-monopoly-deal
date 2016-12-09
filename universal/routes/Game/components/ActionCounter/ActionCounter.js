import React, { PropTypes } from 'react'
import { Badge } from 'react-bootstrap'

export default class ActionCounter extends React.Component {
  static propTypes = {
    count: PropTypes.number.isRequired
  };

  render () {
    return (
      <p>
        <Badge>
          {this.props.count}
        </Badge>
      </p>
    )
  }
}

