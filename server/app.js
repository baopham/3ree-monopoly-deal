import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'
import { RouterContext, match } from 'react-router'

import configureStore from '../universal/store'
import routes from '../universal/routes'

const isDev = (process.env.NODE_ENV !== 'production')

export function handleRender (req, res) {
  console.log(' [x] Request for', req.url)

  // TODO: use redial
  let initialState = {}

  const store = configureStore(req, initialState)

  // Wire up routing based upon routes
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error || !renderProps) {
      console.log(error || 'Error: No matching universal route found')

      res.status(400)
      res.send(error || 'Error: No matching universal route found')
      return
    }

    if (redirectLocation) {
      res.redirect(redirectLocation)
      return
    }

    // Render the component to a string
    const html = ReactDOMServer.renderToString(
      <Provider store={store}>
        <div>
          <RouterContext {...renderProps} />
        </div>
      </Provider>
    )

    // Send the rendered page back to the client with the initial state
    res.render('index', { isProd: (!isDev), html: html, initialState: JSON.stringify(store.getState()) })
  })
}
