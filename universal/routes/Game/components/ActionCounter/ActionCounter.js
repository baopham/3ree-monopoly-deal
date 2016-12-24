/* @flow */
import React from 'react'
import { Label } from 'react-bootstrap'
import { MAX_NUMBER_OF_ACTIONS } from '../../../../monopoly/monopoly'

type Props = {
  count: number,
  className?: string
}

export default class ActionCounter extends React.Component {
  props: Props

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
