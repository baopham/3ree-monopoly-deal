/* @flow */
import GameService from '../services/GameService'
import PlayerService from '../services/PlayerService'

const gameService = new GameService()
const playerService = new PlayerService()

declare class AppRequest extends AppRequest {
  body: any
}

function handleError (err, res) {
  console.error(err)
  res.status(400)
  res.json({ error: err })
}

export function drawCards (req: AppRequest, res: express$Response) {
  const promise = playerService.drawCards(req.params.id)

  promise
    .then(cards => res.json({ cards }))
    .catch(err => handleError(err, res))
}

export function discardCard (req: AppRequest, res: express$Response) {
  res.json()
}

export function placeCard (req: AppRequest, res: express$Response) {
  const promise = playerService.placeCard(req.params.id, req.body.username, req.body.card, req.body.asMoney)

  promise
    .then(() => res.json({ success: true }))
    .catch(err => handleError(err, res))
}

export function playCard (req: AppRequest, res: express$Response) {
  const promise = playerService.playCard(req.params.id, req.body.username, req.body.card)

  promise
    .then(() => res.json({ success: true }))
    .catch(err => handleError(err, res))
}

export function giveCardToOtherPlayer (req: AppRequest, res: express$Response) {
  res.json()
}

export function joinGame (req: AppRequest, res: express$Response) {
  const promise = gameService.addPlayer(req.params.id, req.body.username)

  promise
    .then(newPlayer => res.json({ newPlayer }))
    .catch(err => handleError(err, res))
}

export function endTurn (req: AppRequest, res: express$Response) {
  const promise = playerService.endTurn(req.params.id)

  promise
    .then(nextTurn => res.json({ nextTurn }))
    .catch(err => handleError(err, res))
}

export function flipCard (req: AppRequest, res: express$Response) {
  const promise = playerService.flipCard(req.params.id, req.body.username, req.body.card)

  promise
    .then(flippedCard => res.json({ flippedCard }))
    .catch(err => handleError(err, res))
}
