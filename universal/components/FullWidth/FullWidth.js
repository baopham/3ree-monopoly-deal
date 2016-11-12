import React, { PropTypes } from 'react'
import { Col } from 'react-bootstrap'
import Container from '../Container'

export default class FullWidth extends React.Component {
  static propTypes = {
    fluid: PropTypes.bool
  }

  render () {
    const { className = '', fluid } = this.props

    return (
      <Container className={className} fluid={fluid}>
        <Col xs={12}>
          {this.props.children}
        </Col>
      </Container>
    )
  }
}

