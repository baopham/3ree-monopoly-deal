import React, { PropTypes } from 'react'
import { Label } from 'react-bootstrap'
import { MAX_NUMBER_OF_ACTIONS } from '../../../../monopoly/monopoly'

export default class ActionCounter extends React.Component {
  static propTypes = {
    count: PropTypes.number.isRequired
  };

  render () {
    const { className, count } = this.props

    return (
      <p className={className}>
        Played
        {' '}
        <Label bsStyle={count >= MAX_NUMBER_OF_ACTIONS - 1 ? 'danger' : 'info'}>
          {count}
        </Label>
        {' '}
        actions
      </p>
    )
  }
}

