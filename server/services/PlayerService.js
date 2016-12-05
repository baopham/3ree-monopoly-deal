import PlayerRepository from '../repositories/PlayerRepository'
import GameRepository from '../repositories/GameRepository'
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
        return this.playerRepository.update(player.id, player);
      })
  }

  playCard (gameId, username, card) {
    return this.discardCard(gameId, username, card)
  }

  discardCard (gameId, username, card) {
    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then(player => {
        player.game.discardedCards.push(card)
        return this.gameRepository.update(gameId, player.game)
      })
  }

  giveCardToOtherPlayer (gameId, otherPlayerUsername, card, asMoney = false) {
    const isMoneyCard = asMoney || monopoly.isMoneyCard(card)

    const otherPlayer = this.playerRepository.findByGameIdAndUsername(gameId, otherPlayerUsername)

    const area = isMoneyCard ? 'bank' : 'properties'

    otherPlayer.placedCards[area].push(card)

    return this.playerRepository.update(otherPlayer.id, otherPlayer)
  }
}

