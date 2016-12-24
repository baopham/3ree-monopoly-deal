/* @flow */
import React from 'react'
import { Route, IndexRoute } from 'react-router'

import CoreLayout from '../layouts/CoreLayout'
import GameRoute from './Game'
import GamesRoute from './Games'

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute components={GamesRoute} />
    <Route path='games' components={GamesRoute} />
    <Route path='games/:id' component={GameRoute} />
  </Route>
)
