/* @flow */
import GameService from '../services/GameService'
import PlayerService from '../services/PlayerService'
import PlayerPlacedCardService from '../services/PlayerPlacedCardService'
import SayNoService from '../services/SayNoService'
import CardRequestService from '../services/CardRequestService'
import * as request from '../../universal/request-util'

const gameService = new GameService()
const playerService = new PlayerService()
const playerPlacedCardService = new PlayerPlacedCardService()
const sayNoService = new SayNoService()
const cardRequestService = new CardRequestService()

declare class AppRequest extends express$Request {
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
  const promise = playerPlacedCardService.flipPlacedCard(
    req.params.id,
    req.body.username,
    req.body.card,
    req.body.propertySetId
  )

  promise
    .then(flippedCard => res.json({ flippedCard }))
    .catch(err => handleError(err, res))
}

export function flipPlacedLeftOverCard (req: AppRequest, res: express$Response) {
  const promise = playerPlacedCardService.flipPlacedLeftOverCard(
    req.params.id,
    req.body.username,
    req.body.card
  )

  promise
    .then(flippedCard => res.json({ flippedCard }))
    .catch(err => handleError(err, res))
}

export function movePlacedCard (req: AppRequest, res: express$Response) {
  const promise = playerPlacedCardService.movePlacedCard(
    req.params.id,
    req.body.username,
    req.body.card,
    req.body.fromSetId,
    req.body.toSetId
  )

  promise
    .then(() => res.json('success'))
    .catch(err => handleError(err, res))
}

export function movePlacedLeftOverCard (req: AppRequest, res: express$Response) {
  const promise = playerPlacedCardService.movePlacedLeftOverCard(
    req.params.id,
    req.body.username,
    req.body.card,
    req.body.toSetId
  )

  promise
    .then(() => res.json('success'))
    .catch(err => handleError(err, res))
}

export function requestToSlyDeal (req: AppRequest, res: express$Response) {
  const promise = cardRequestService.requestToSlyDeal(req.params.id, req.body)

  promise
    .then(([cardRequest]) => res.json({ cardRequest }))
    .catch(err => handleError(err, res))
}

export function acceptSlyDeal (req: AppRequest, res: express$Response) {
  const promise = cardRequestService.acceptSlyDeal(req.params.requestId)

  promise
    .then(() => res.json('success'))
    .catch(err => handleError(err, res))
}

export function sayNoToUser (req: AppRequest, res: express$Response) {
  const promise = sayNoService.sayNoToUser(
    req.params.id,
    req.params.fromUser,
    req.params.toUser,
    req.body.cause,
    req.body.causeInfo
  )

  promise
    .then(() => res.json('success'))
    .catch(err => handleError(err, res))
}

export function acceptSayNo (req: AppRequest, res: express$Response) {
  const promise = sayNoService.acceptSayNo(req.params.id, req.params.fromUser, req.params.toUser)

  promise
    .then(() => res.json('success'))
    .catch(err => handleError(err, res))
}
