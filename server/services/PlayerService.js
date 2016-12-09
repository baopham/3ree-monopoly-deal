import PlayerRepository from '../repositories/PlayerRepository'
import GameRepository from '../repositories/GameRepository'
import Promise from 'bluebird'
import * as monopoly from '../../universal/monopoly/monopoly'

export default class PlayerService {
  constructor () {
    this.playerRepository = new PlayerRepository()
    this.gameRepository = new GameRepository()
  }

  static liveUpdates (io) {
    PlayerRepository.watchForChanges((change) => {
      io.emit(`game-${change.new_val.gameId}-player-change`, change)
    })
  }

  placeCard (gameId, username, card, asMoney = false) {
    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then(player => {
        const area = asMoney ? 'bank' : 'properties'
        player.placedCards[area].push(card)
        player.actionCounter = player.actionCounter + 1
        return this.playerRepository.update(player.id, player)
      })
  }

  playCard (gameId, username, card) {
    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then(player => {
        player.game.discardedCards.push(card)
        player.actionCounter = player.actionCounter + 1

        return Promise.all([
          this.gameRepository.update(gameId, player.game),
          this.playerRepository.update(player.id, player)
        ])
      })
  }

  discardCard (gameId, username, card) {
    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then(player => {
        player.game.discardedCards.push(card)
        return this.gameRepository.update(gameId, player.game)
      })
  }

  endTurn (gameId) {
    return this.gameRepository.find(gameId)
      .then(game => {
        const players = game.players
        const currentTurnIndex = players.findIndex(player => player.username === game.currentTurn)
        const currentPlayer = players[currentTurnIndex]
        const nextTurnIndex = currentTurnIndex + 1 === players.length ? 0 : currentTurnIndex + 1
        const nextTurn = game.players[nextTurnIndex].username

        game.currentTurn = nextTurn
        currentPlayer.actionCounter = 0

        return Promise.all([
          this.gameRepository.update(gameId, game),
          this.playerRepository.update(currentPlayer.id, currentPlayer)
        ])
      })
      .then(([game, player]) => game.currentTurn)
  }

  giveCardToOtherPlayer (gameId, otherPlayerUsername, card, asMoney = false) {
    const isMoneyCard = asMoney || monopoly.isMoneyCard(card)

    const otherPlayer = this.playerRepository.findByGameIdAndUsername(gameId, otherPlayerUsername)

    const area = isMoneyCard ? 'bank' : 'properties'

    otherPlayer.placedCards[area].push(card)

    return this.playerRepository.update(otherPlayer.id, otherPlayer)
  }
}

