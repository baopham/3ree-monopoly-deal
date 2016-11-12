import React, { PropTypes } from 'react'
import { Grid, Row } from 'react-bootstrap'

export default class Container extends React.Component {
  static propTypes = {
    fluid: PropTypes.bool
  }

  render () {
    const { className = '', fluid } = this.props

    return (
      <Grid className={className} fluid={fluid}>
        <Row>
          {this.props.children}
        </Row>
      </Grid>
    )
  }
}

