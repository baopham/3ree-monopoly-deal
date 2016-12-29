/* @flow */
import GameService from '../services/GameService'
import PlayerService from '../services/PlayerService'
import * as request from '../../universal/request-util'

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
  const promise = playerService.discardCard(req.params.id, req.body.username, req.body.card)

  promise
    .then(() => res.json())
    .catch(err => handleError(err, res))
}

export function placeCard ({ params, body }: AppRequest, res: express$Response) {
  const promise = playerService.placeCard(params.id, body.username, body.card, body.asMoney, body.setToPutIn)

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

export function pay (req: AppRequest, res: express$Response) {
  const promise = playerService.pay(
    req.params.id,
    req.body.payer,
    req.body.payee,
    req.body.moneyCards,
    request.jsonToMap(req.body.mapOfNonMoneyCards)
  )

  promise
    .then(() => res.json('success'))
    .catch(err => handleError(err, res))
}

export function setWinner (req: AppRequest, res: express$Response) {
  const promise = gameService.setWinner(req.params.id, req.body.winner)

  promise
    .then(() => res.json('success'))
    .catch(err => handleError(err, res))
}

export function flipPlacedCard (req: AppRequest, res: express$Response) {
  const promise = playerService.flipPlacedCard(req.params.id, req.body.username, req.body.card, req.body.propertySetId)

  promise
    .then(flippedCard => res.json({ flippedCard }))
    .catch(err => handleError(err, res))
}

export function moveCard (req: AppRequest, res: express$Response) {
  const promise = playerService.moveCard(
    req.params.id,
    req.body.username,
    req.body.card,
    req.body.fromSetId,
    req.body.toSetId
  )

  promise
    .then(() => res.json())
    .catch(err => handleError(err, res))
}
