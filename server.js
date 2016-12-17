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
 * API Endpoints
 */
app.get('/api/v1/games', api.games.getGames)
app.get('/api/v1/games/:id', api.games.getGame)
app.post('/api/v1/games', api.games.addGame)
app.post('/api/v1/games/:id', api.games.updateGame)
app.delete('/api/v1/games/:id', api.games.deleteGame)

app.post('/api/v1/games/:id/join', api.game.joinGame)
app.put('/api/v1/games/:id', api.game.endTurn)
app.get('/api/v1/games/:id/draw', api.game.drawCards)
app.put('/api/v1/games/:id/discard', api.game.discardCard)
app.put('/api/v1/games/:id/place', api.game.placeCard)
app.put('/api/v1/games/:id/play', api.game.playCard)
app.put('/api/v1/games/:id/flip', api.game.flipCard)
app.put('/api/v1/games/:id/end-turn', api.game.endTurn)
app.put('/api/v1/games/:id/pay', api.game.pay)

app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'static', 'images', 'favicon.ico')))
app.use(express.static('static'))

/**
 * Universal Application endpoint
 */
app.get('*', uni.handleRender)

setupRealtime(io)

httpServer.listen(port)

console.log(`HTTP server listening on port ${port}`)
