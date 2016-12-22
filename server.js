import path from 'path'
import bodyParser from 'body-parser'
import express from 'express'
import compress from 'compression'
import http from 'http'
import socketIO from 'socket.io'
import config from 'config'
import setupRealtime from './server/real-time'
import * as uni from './server/app'

const app = express()
const httpServer = http.createServer(app)
const port = config.get('express.port') || 3000
const io = socketIO(httpServer)

app.set('views', path.join(__dirname, 'server', 'views'))
app.set('view engine', 'ejs')

/**
 * Server middleware
 */
app.use(compress())
app.use(require('serve-static')(path.join(__dirname, config.get('buildDirectory'))))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

/**
 * Apply Webpack HMR Middleware and clear require cache on server code changes
 */
if (process.env.NODE_ENV === 'development') {
  const webpackConfig = require('./webpack.config')
  const compiler = require('webpack')(webpackConfig)

  console.log('Enabling webpack dev and HMR middleware')

  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    quiet: true,
    noInfo: true,
    lazy: false
  }))
  app.use(require('webpack-hot-middleware')(compiler))

  console.log('Watching server/universal files')

  const chokidar = require('chokidar')
  const watcher = chokidar.watch(['./server', './universal'])
  watcher.on('ready', () => {
    watcher.on('all', () => {
      Object.keys(require.cache).forEach((id) => {
        if (id.includes('/server/') || id.includes('/universal/')) {
          delete require.cache[id]
        }
      })
    })
  })
}

/**
 * API Endpoints
 */
app.use((req, res, next) => {
  require('./server/api')(req, res, next)
})
app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'static', 'images', 'favicon.ico')))
app.use(express.static('static'))

/**
 * Universal Application endpoint
 */
app.get('*', uni.handleRender)

setupRealtime(io)

httpServer.listen(port)

console.log(`HTTP server listening on port ${port}`)
