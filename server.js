import path from 'path'
import bodyParser from 'body-parser'
import express from 'express'
import compress from 'compression'
import http from 'http'
import socketIO from 'socket.io'
import config from 'config'

import api from './server/api'
import setupRealtime from './server/real-time'
import * as uni from './server/app'

const app = express()
const httpServer = http.createServer(app)
const port = config.get('express.port') || 3000

var io = socketIO(httpServer)

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
 * API Endpoints
 */
app.get('/api/1/games', api.games.getGames)
app.post('/api/1/games', api.games.addGame)
app.post('/api/1/games/:id', api.games.updateGame)
app.delete('/api/1/games/:id', api.games.deleteGame)

app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'images', 'favicon.ico')))

/**
 * Universal Application endpoint
 */
app.get('*', uni.handleRender)

setupRealtime(io)

httpServer.listen(port)
