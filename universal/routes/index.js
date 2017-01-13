/* @flow */
import React from 'react'
import { Route, IndexRoute } from 'react-router'

import CoreLayout from '../layouts/CoreLayout'
import GameView from './Game'
import GamesView from './Games'

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute components={GamesView} />
    <Route path='games' components={GamesView} />
    <Route path='games/:id' component={GameView} />
  </Route>
)

