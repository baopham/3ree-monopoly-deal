import * as games from './games'
import * as game from './game'
import express from 'express'

const router = express.Router()

router.get('/api/v1/games', games.getGames)
router.get('/api/v1/games/:id', games.getGame)
router.post('/api/v1/games', games.addGame)
router.post('/api/v1/games/:id', games.updateGame)
router.delete('/api/v1/games/:id', games.deleteGame)
router.post('/api/v1/games/:id/join', game.joinGame)
router.put('/api/v1/games/:id', game.endTurn)
router.get('/api/v1/games/:id/draw', game.drawCards)
router.put('/api/v1/games/:id/discard', game.discardCard)
router.put('/api/v1/games/:id/place', game.placeCard)
router.put('/api/v1/games/:id/play', game.playCard)
router.put('/api/v1/games/:id/flip', game.flipCard)
router.put('/api/v1/games/:id/end-turn', game.endTurn)
router.put('/api/v1/games/:id/pay', game.pay)
router.put('/api/v1/games/:id/winner', game.setWinner)

module.exports = router
