import GameService from '../services/GameService'
import Promise from 'bluebird'

const service = new GameService()

function handleError (err, res) {
  console.error(err)
  res.status(400)
  res.json({ error: err })
}

export function getGames (req, res) {
  const promise = Promise.props({
    games: service.getGames(req.query.page),
    count: service.getCount()
  })

  promise
    .then(result => res.json(result))
    .catch(err => handleError(err, res))
}

export function addGame (req, res) {
  const promise = Promise.props({
    game: service.addGame(req.body),
    count: service.getCount()
  })

  promise
    .then(result => res.json(result))
    .catch(err => handleError(err, res))
}

export function updateGame (req, res) {
  const promise = Promise.props({
    game: service.updateGame(req.params.id, req.body),
    count: service.getCount()
  })

  promise
    .then(result => res.json(result))
    .catch(err => handleError(err, res))
}

export function deleteGame (req, res) {
  const promise = Promise.props({
    game: service.deleteGame(req.params.id),
    count: service.getCount()
  })

  promise
    .then(result => res.json(result))
    .catch(err => handleError(err, res))
}

