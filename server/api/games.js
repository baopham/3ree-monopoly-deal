/* @flow */
import GameService from '../services/GameService'

const service = new GameService()

declare class AppRequest extends AppRequest {
  body: any
}

function handleError (err, res) {
  console.error(err)
  res.status(400)
  res.json({ error: err })
}

export function getGames (req: AppRequest, res: express$Response) {
  const promise = Promise.all([
    service.getGames(req.query.page),
    service.getCount()
  ])

  promise
    .then(([games, count]) => res.json({ games, count }))
    .catch(err => handleError(err, res))
}

export function getGame (req: AppRequest, res: express$Response) {
  const promise = service.getGame(req.params.id)

  promise
    .then(game => res.json({ game }))
    .catch(err => handleError(err, res))
}

export function addGame (req: AppRequest, res: express$Response) {
  const promise = Promise.all([
    service.addGame(req.body),
    service.getCount()
  ])

  promise
    .then(([game, count]) => res.json({ game, count }))
    .catch(err => handleError(err, res))
}

export function updateGame (req: AppRequest, res: express$Response) {
  const promise = Promise.all([
    service.updateGame(req.params.id, req.body),
    service.getCount()
  ])

  promise
    .then(([game, count]) => res.json({ game, count }))
    .catch(err => handleError(err, res))
}

export function deleteGame (req: AppRequest, res: express$Response) {
  const promise = Promise.all([
    service.deleteGame(req.params.id),
    service.getCount()
  ])

  promise
    .then(([game, count]) => res.json({ game, count }))
    .catch(err => handleError(err, res))
}
