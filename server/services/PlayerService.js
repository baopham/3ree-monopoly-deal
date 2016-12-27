/* @flow */
import PlayerRepository from '../repositories/PlayerRepository'
import GameService from './GameService'
import GameHistoryService from './GameHistoryService'
import * as monopoly from '../../universal/monopoly/monopoly'
import PropertySet from '../../universal/monopoly/PropertySet'
import {
  PROPERTY_WILDCARD,
  HOUSE,
  HOTEL,
  newDeck
} from '../../universal/monopoly/cards'

export default class PlayerService {
  playerRepository: PlayerRepository
  gameService: GameService
  gameHistoryService: GameHistoryService

  constructor () {
    this.playerRepository = new PlayerRepository()
    this.gameService = new GameService()
    this.gameHistoryService = new GameHistoryService()
  }

  static liveUpdates (io) {
    PlayerRepository.watchForChanges((change) => {
      io.emit(`game-${change.new_val.gameId}-player-change`, change)
    })
  }

  placeCard (gameId: string, username: Username, cardKey: CardKey, asMoney: boolean = false): Promise<*> {
    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then(increaseActionCounter)
      .then(putCardInTheRightPlace)
      .then(logAction.bind(this))

    //////
    function increaseActionCounter (player: Player) {
      player.actionCounter = player.actionCounter + 1
      return player
    }

    function putCardInTheRightPlace (player: Player) {
      if (asMoney) {
        player.placedCards.bank.push(cardKey)
        return player.save()
      }

      // TODO: deal with wildcard, house, hotel
      if (cardKey === PROPERTY_WILDCARD || cardKey === HOUSE || cardKey === HOTEL) {
        return Promise.reject(`Not ready for ${cardKey}`)
      }

      const card = monopoly.getCardObject(cardKey)

      // Side effect
      // Put in the first non full set of the same colour
      const hasBeenPlaced = player.placedCards
        .serializedPropertySets
        .some((set, index) => {
          if (set.identifier.key !== card.treatAs) {
            return false
          }

          if (monopoly.unserializePropertySet(set).isFullSet()) {
            return false
          }

          set.cards.push(cardKey)

          return true
        })

      if (!hasBeenPlaced) {
        const newPropertySet = new PropertySet(monopoly.getCardObject(card.treatAs), [cardKey]).serialize()
        player.placedCards.serializedPropertySets.push(newPropertySet)
      }

      return player.save()
    }

    function logAction (player: Player) {
      return this.gameHistoryService.record(gameId, `${username} placed ${cardKey}`)
    }
  }

  playCard (gameId: string, username: Username, cardKey: CardKey): Promise<*> {
    const cardRequiresPayment = monopoly.cardRequiresPayment(cardKey)

    const promises = [
      this.playerRepository.findByGameIdAndUsername(gameId, username)
    ]

    if (cardRequiresPayment) {
      promises.push(this.playerRepository.getAllPlayers(gameId))
    }

    return Promise.all(promises)
      .then(([player: Player, players: Player[]]) => {
        player.game.lastCardPlayedBy = username
        player.game.discardedCards.push(cardKey)
        player.actionCounter = player.actionCounter + 1

        if (cardRequiresPayment) {
          player.payeeInfo = {
            cardPlayed: cardKey,
            amount: monopoly.getCardPaymentAmount(cardKey, player.placedCards.serializedPropertySets),
            payers: players.filter(p => p.username !== username).map(p => p.username)
          }
        }

        const notifyUsers = player.payeeInfo ? player.payeeInfo.payers : undefined

        return Promise.all([
          player.saveAll(),
          this.gameHistoryService.record(gameId, `${username} played ${cardKey}`, notifyUsers)
        ])
      })
  }

  discardCard (gameId: string, username: Username, card: CardKey): Promise<*> {
    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then((player: Player) => {
        player.game.discardedCards.push(card)
        player.game.lastCardPlayedBy = username
        return Promise.all([
          player.game.save(),
          this.gameHistoryService.record(gameId, `${username} discarded ${card}`)
        ])
      })
  }

  endTurn (gameId: string): Promise<Username> {
    return this.gameService.getGame(gameId)
      .then((game: Game) => {
        const players = game.players
        const currentTurnIndex = players.findIndex(player => player.username === game.currentTurn)
        const currentPlayer = players[currentTurnIndex]
        const nextTurnIndex = currentTurnIndex + 1 === players.length ? 0 : currentTurnIndex + 1
        const nextTurn = game.players[nextTurnIndex].username

        game.currentTurn = nextTurn
        currentPlayer.actionCounter = 0

        return Promise.all([
          game.saveAll(),
          this.gameHistoryService.record(gameId, `${nextTurn}'s turn`)
        ])
      })
      .then(([game, _]) => game.currentTurn)
  }

  drawCards (gameId: string): Promise<CardKey[]> {
    return this.gameService.getGame(gameId)
      .then((game: Game) => {
        if (game.availableCards.length < 2) {
          game.availableCards = newDeck()
        }

        const [first, second, ...rest] = game.availableCards
        game.availableCards = rest

        return Promise.all([
          [first, second],
          this.gameHistoryService.record(gameId, `${game.currentTurn} picked up 2 cards`),
          game.save()
        ])
      })
      .then(([drawnCards]) => drawnCards)
  }

  pay (
    gameId: string,
    payer: Username,
    payee: Username,
    moneyCards: CardKey[],
    paymentSerializedSets: SerializedPropertySet[]
  ): Promise<*> {
    const promises = [
      this.playerRepository.findByGameIdAndUsername(gameId, payee),
      this.playerRepository.findByGameIdAndUsername(gameId, payer)
    ]

    return Promise.all(promises)
      .then(([payeePlayer: Player, payerPlayer: Player]) => {
        const dueAmount = payeePlayer.payeeInfo.amount
        return Promise.all([
          updatePayer(payerPlayer),
          updatePayee(payeePlayer),
          this.gameHistoryService.record(gameId, paymentLogMessage(dueAmount))
        ])
      })

    //////
    function updatePayee (payeePlayer: Player): Promise<*> {
      const { payeeInfo } = payeePlayer

      if (!payeeInfo.payers || !payeeInfo.payers.includes(payer)) {
        return Promise.reject(`${payer} does not owe anything`)
      }

      // Since payer is paying their due, we remove them from the list.
      payeePlayer.payeeInfo.payers = payeeInfo.payers.filter(p => p !== payer)

      // If we don't have any payers left, reset payeeInfo.
      if (!payeePlayer.payeeInfo.payers.length) {
        payeePlayer.payeeInfo.amount = 0
        payeePlayer.payeeInfo.cardPlayed = null
      }

      // Merge the property sets.
      const { placedCards } = payeePlayer

      const leftOverNonPropertyCards = monopoly.mergeSerializedPropertySets(
        placedCards.serializedPropertySets,
        paymentSerializedSets
      )

      // Put money cards into the bank.
      placedCards.bank = placedCards.bank.concat(moneyCards).concat(leftOverNonPropertyCards)

      return payeePlayer.save()
    }

    function updatePayer (payerPlayer: Player): Promise<*> {
      const { placedCards } = payerPlayer

      // Remove the money cards
      moneyCards.forEach(card => {
        const indexToRemove = placedCards.bank.findIndex(c => c === card)
        placedCards.bank.splice(indexToRemove, 1)
      })

      // Remove the property sets, if there are any to remove.
      if (!paymentSerializedSets.length) {
        return payerPlayer.save()
      }

      placedCards.serializedPropertySets.forEach((item, index) => {
        const paymentSerializedSet = paymentSerializedSets.find(s => s.identifier.key === item.identifier.key)

        if (!paymentSerializedSet) {
          return
        }

        const thisPropertySet = monopoly.unserializePropertySet(item)
        const thatPropertySet = monopoly.unserializePropertySet(paymentSerializedSet)

        if (!thisPropertySet.equals(thatPropertySet)) {
          return
        }

        placedCards.serializedPropertySets.splice(index, 1)
      })

      return payerPlayer.save()
    }

    function paymentLogMessage (dueAmount: number): string {
      if (!moneyCards.length && !paymentSerializedSets.length) {
        return `${payer} has no money to pay ${payee} $${dueAmount}M`
      }

      const allCards = moneyCards.concat(paymentSerializedSets.map(s => s.cards.join(', ')))

      return `${payer} paid ${payee} $${dueAmount}M with ${allCards.join(', ')}`
    }
  }
}
