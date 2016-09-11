import ReactDOM from 'react-dom'
import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import setupRealtime from './real-time'

import routes from '../universal/routes'
import store from '../universal/store'

import Root from '../universal/containers/Root'

import '../style/pure.css'
import '../style/main.styl'
import '../style/spinner.styl'

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Root store={store} routing={routes} history={history} />,
  document.getElementById('app')
)

// Now that we have rendered...
setupRealtime(store)
