import GameService from '../services/GameService'
import MemberService from '../services/MemberService'
import Promise from 'bluebird'

const gameService = new GameService()
const memberService = new MemberService()

function handleError (err, res) {
  console.error(err)
  res.status(400)
  res.json({ error: err })
}

export function drawCards (req, res) {
  const promise = gameService.drawCards(req.params.id)

  promise
    .then(cards => res.json({ cards }))
    .catch(err => handleError(err, res))
}

export function discardCard (req, res) {
  res.json()
}

export function placeCard (req, res) {
  const promise = memberService.placeCard(req.params.id, req.body.username, req.body.card, req.body.asMoney)

  promise
    .then(() => res.json({ success: true }))
    .catch(err => handleError(err, res))
}

export function giveCardToOtherMember (req, res) {
  res.json()
}

export function joinGame (req, res) {
  const promise = gameService.addMember(req.params.id, req.body.username)

  promise
    .then(newMember => res.json({ newMember }))
    .catch(err => handleError(err, res))
}

export function endTurn (req, res) {
  const promise = gameService.endTurn(req.params.id)

  promise
    .then(nextTurn => res.json({ nextTurn }))
    .catch(err => handleError(err, res))
}
