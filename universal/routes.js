import React from 'react'
import { Route, IndexRoute } from 'react-router'

import CoreLayout from './layouts/CoreLayout'
import HomeView from './views/HomeView'
import GamesView from './views/GamesView'
import GameView from './views/GameView'

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute components={HomeView} />
    <Route path='games' components={GamesView} />
    <Route path='games/:id' component={GameView} />
  </Route>
)
