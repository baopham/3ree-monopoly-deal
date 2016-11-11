import React, { PropTypes, Component } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    routing: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  render () {
    const { store, routing, history } = this.props
    return (
      <Provider store={store}>
        <div>
          <Router history={history}>
            {routing}
          </Router>
        </div>
      </Provider>
    )
  }
}
