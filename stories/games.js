/* @flow */
import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import state from './games.state'
import { GamesView } from '../universal/routes/Games/containers/GamesView/GamesView'

storiesOf('games.GamesView', module)
  .add('list of games', () => (
    <GamesView
      games={state.games}
      addGame={action('adding game')}
      getGames={action('fetching games')}
      subscribeSocket={action('subscribe socket events')}
      unsubscribeSocket={action('unsubscribe socket events')}
    />
  ))
