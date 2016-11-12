import GameService from '../services/GameService'
import Promise from 'bluebird'

const service = new GameService()

function handleError (err, res) {
  console.error(err)
  res.status(400)
  res.json({ error: err })
}

export function drawCards (req, res) {
  const promise = service.drawCards(req.params.id)

  promise
    .then(cards => res.json({ cards }))
    .catch(err => handleError(err, res))
}

export function discardCard (req, res) {
  res.json()
}

export function placeCard (req, res) {
  res.json()
}

export function giveCardToOtherMember (req, res) {
  res.json()
}

export function joinGame (req, res) {
  const promise = service.addMember(req.params.id, req.body.username)

  promise
    .then(newMember => res.json({ newMember }))
    .catch(err => handleError(err, res))
}

export function endTurn (req, res) {
  const promise = service.endTurn(req.params.id)

  promise
    .then(nextTurn => res.json({ nextTurn }))
    .catch(err => handleError(err, res))
}
