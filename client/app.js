import ReactDOM from 'react-dom'
import React from 'react'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import socketClient from 'socket.io-client'

import routes from '../universal/routes'
import store from '../universal/store'

import Root from '../universal/containers/Root'

const history = syncHistoryWithStore(browserHistory, store)

global.socket = socketClient()

ReactDOM.render(
  <Root store={store} routing={routes} history={history} />,
  document.getElementById('app')
)

