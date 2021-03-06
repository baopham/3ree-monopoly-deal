/* @flow */
import PlayerRepository from '../../repositories/PlayerRepository'
import GameService from '../GameService'
import GameHistoryService from '../GameHistoryService'
import * as monopoly from '../../../universal/monopoly/monopoly'
import {
  PROPERTY_WILDCARD,
  HOUSE,
  HOTEL,
  RENT_ALL_COLOUR,
  DEBT_COLLECTOR,
  PASS_GO,
  newDeck,
  getCardObject
} from '../../../universal/monopoly/cards'
import PropertySet from '../../../universal/monopoly/PropertySet'
import * as paymentHelper from './paymentHelper'
import * as sideEffectUtils from '../../side-effect-utils'
import { markCard } from '../../../universal/monopoly/logMessageParser'
import type { PropertySetId } from '../../../universal/monopoly/PropertySet'

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

  async placeCard (
    gameId: string, username: Username, cardKey: CardKey, asMoney: boolean = false, setToPutIn?: SerializedPropertySet
  ): Promise<*> {
    const player: Player = await this.playerRepository.findByGameIdAndUsername(gameId, username)

    const updatedPlayer = await putCardInTheRightPlace(Object.assign(
      player,
      { actionCounter: player.actionCounter + 1 }
    ))

    await this.gameHistoryService.record(gameId, `${username} placed ${markCard(cardKey)}`)

    return updatedPlayer

    //////
    function putCardInTheRightPlace (player: Player): Promise<*> {
      if (asMoney) {
        player.placedCards.bank.push(cardKey)
        return player.save()
      }

      if ([HOUSE, HOTEL, PROPERTY_WILDCARD].includes(cardKey)) {
        return putIntoASet(player)
      }

      const card = getCardObject(cardKey)

      // Side effect
      const hasBeenPlaced = monopoly.putInTheFirstNonFullSet(cardKey, player.placedCards.serializedPropertySets)

      if (!hasBeenPlaced) {
        const newPropertySet = new PropertySet(getCardObject(card.treatAs), [cardKey]).serialize()
        sideEffectUtils.addSetToPlacedCards(newPropertySet, player.placedCards)
      }

      return player.save()
    }

    function putIntoASet (player: Player): Promise<*> {
      if (!setToPutIn) {
        throw new Error(`Need to provide what set to put ${cardKey} in`)
      }

      const propertySetToPutIn = PropertySet.unserialize(setToPutIn)

      const playerSerializedSet = player.placedCards.serializedPropertySets
        .find(s => PropertySet.unserialize(s).equals(propertySetToPutIn))

      if (!playerSerializedSet) {
        throw new Error('Cannot place card in the set. Player has no such set')
      }

      const playerUnserializedSet = PropertySet.unserialize(playerSerializedSet)

      if (!playerUnserializedSet.addCard(cardKey)) {
        throw new Error(`Cannot place ${cardKey}. Invalid property set`)
      }

      // Update in place
      Object.assign(playerSerializedSet, playerUnserializedSet.serialize())

      return player.save()
    }
  }

  async playCard (
    gameId: string,
    username: Username,
    cardKey: CardKey
  ): Promise<[?CardKey[], Player, GameHistoryRecord]> {
    const promises = [
      this.playerRepository.findByGameIdAndUsername(gameId, username)
    ]

    const cardRequiresPayment = monopoly.cardRequiresPayment(cardKey)

    if (cardRequiresPayment) {
      promises.push(this.playerRepository.getAllPlayers(gameId))
    }

    const [player: Player, players: Player[]] = await Promise.all(promises)

    const paymentAmount = paymentHelper.getCardPaymentAmount(player.game, player, cardKey)

    player.game.lastCardPlayedBy = username
    player.game.discardedCards.push(cardKey)
    player.actionCounter += 1

    if (cardRequiresPayment) {
      player.payeeInfo = {
        cardPlayed: cardKey,
        amount: paymentAmount,
        payers: players.filter(p => p.username !== username).map(p => p.username)
      }
    }

    const playersToNotify = player.payeeInfo ? player.payeeInfo.payers : undefined

    return Promise.all([
      cardKey === PASS_GO ? Promise.resolve(this._pickUpCards(player, player.game)) : Promise.resolve(null),
      player.saveAll(),
      this.gameHistoryService.record(gameId, `${username} played ${markCard(cardKey)}`, playersToNotify)
    ])
  }

  async targetPayment (gameId: string, payee: Username, targetUser: Username, cardKey: CardKey): Promise<*> {
    if (![DEBT_COLLECTOR, RENT_ALL_COLOUR].includes(cardKey)) {
      return Promise.reject(new Error(`${cardKey} is not a valid target payment card`))
    }

    const promises = [
      this.playerRepository.findByGameIdAndUsername(gameId, payee),
      this.playerRepository.findByGameIdAndUsername(gameId, targetUser)
    ]

    const [thisPlayer: Player, otherPlayer: Player] = await Promise.all(promises)

    if (!otherPlayer) {
      throw new Error('The target user does not exist')
    }

    const paymentAmount = paymentHelper.getCardPaymentAmount(thisPlayer.game, thisPlayer, cardKey)

    thisPlayer.game.lastCardPlayedBy = payee
    thisPlayer.game.discardedCards.push(cardKey)
    thisPlayer.actionCounter += 1

    thisPlayer.payeeInfo = {
      cardPlayed: cardKey,
      amount: paymentAmount,
      payers: [targetUser]
    }

    const playersToNotify = thisPlayer.payeeInfo.payers

    return Promise.all([
      thisPlayer.saveAll(),
      this.gameHistoryService.record(gameId, `${payee} played ${markCard(cardKey)}`, playersToNotify)
    ])
  }

  async discardCard (gameId: string, username: Username, card: CardKey): Promise<*> {
    const player: Player = await this.playerRepository.findByGameIdAndUsername(gameId, username)

    player.game.discardedCards.push(card)
    player.game.lastCardPlayedBy = username

    return Promise.all([
      player.game.save(),
      this.gameHistoryService.record(gameId, `${username} discarded ${markCard(card)}`)
    ])
  }

  async endTurn (gameId: string): Promise<Username> {
    const game: Game = await this.gameService.getGame(gameId)

    const players = game.players
    const currentTurnIndex = players.findIndex(player => player.username === game.currentTurn)
    const currentPlayer = players[currentTurnIndex]
    const nextTurnIndex = currentTurnIndex + 1 === players.length ? 0 : currentTurnIndex + 1
    const nextTurn = game.players[nextTurnIndex].username

    game.currentTurn = nextTurn
    currentPlayer.actionCounter = 0

    await Promise.all([
      game.saveAll(),
      this.gameHistoryService.record(gameId, `${nextTurn}'s turn`, [nextTurn])
    ])

    return game.currentTurn
  }

  async joinGame (gameId: string, username: Username): Promise<[Player, CardKey[]]> {
    const newPlayer: Player = await this.playerRepository.joinGame(gameId, username)

    const [game: Game] = await Promise.all([
      this.gameService.getGame(gameId, true),
      this.gameHistoryService.record(gameId, `${newPlayer.username} has joined`)
    ])

    newPlayer.game = game

    const initialCards = this._pickUpCards(newPlayer, newPlayer.game, true)

    if (game.currentTurn) {
      return [newPlayer, initialCards]
    }

    await Object.assign(game, { currentTurn: username }).save()

    return [newPlayer, initialCards]
  }

  async drawCards (gameId: string, username: Username, emptyHand: boolean = false): Promise<CardKey[]> {
    const player: Player = await this.playerRepository.findByGameIdAndUsername(gameId, username)

    if (player.game.currentTurn !== player.username) {
      throw new Error(`Not ${player.username} turn yet`)
    }

    return this._pickUpCards(player, player.game, emptyHand)
  }

  async removePayer (gameId: string, payer: Username, payee: Username): Promise<*> {
    const promises = [
      this.playerRepository.findByGameIdAndUsername(gameId, payee),
      this.playerRepository.findByGameIdAndUsername(gameId, payer)
    ]

    const [payeePlayer: Player, payerPlayer: Player] = await Promise.all(promises)

    return Promise.all([
      paymentHelper.updatePayee(payeePlayer, payer, [], [], new Map()),
      paymentHelper.updatePayer(payerPlayer, [], [], new Map())
    ])
  }

  async pay (
    gameId: string, payer: Username,
    payee: Username, bankCards: CardKey[], leftOverCards: CardKey[],
    mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>
  ): Promise<*> {
    const [payeePlayer: Player, payerPlayer: Player] = await Promise.all([
      this.playerRepository.findByGameIdAndUsername(gameId, payee),
      this.playerRepository.findByGameIdAndUsername(gameId, payer)
    ])

    const dueAmount = payeePlayer.payeeInfo.amount

    if (
      !paymentHelper.validatePayerHasGivenCards(payerPlayer, bankCards, leftOverCards, mapOfNonMoneyCards) ||
      !paymentHelper.validatePayerPaymentAmount(payerPlayer, bankCards, leftOverCards, mapOfNonMoneyCards, dueAmount)
    ) {
      throw new Error(`Payer ${payerPlayer.username} is trying to cheat!`)
    }

    return Promise.all([
      updatePayer(payerPlayer),
      updatePayee(payeePlayer),
      this.gameHistoryService.record(gameId, paymentLogMessage(dueAmount))
    ])

    //////
    function updatePayee (payeePlayer: Player): Promise<*> {
      return paymentHelper.updatePayee(payeePlayer, payer, bankCards, leftOverCards, mapOfNonMoneyCards)
    }

    function updatePayer (payerPlayer: Player): Promise<*> {
      return paymentHelper.updatePayer(payerPlayer, bankCards, leftOverCards, mapOfNonMoneyCards)
    }

    function paymentLogMessage (dueAmount: number): string {
      if (!bankCards.length && !mapOfNonMoneyCards.size && !leftOverCards.length) {
        return `${payer} has no money to pay ${payee} $${dueAmount}M`
      }

      const allNonMoneyCards = Array.from(mapOfNonMoneyCards.values()).reduce((acc, cards) => acc.concat(cards), [])
      const allCards = bankCards.concat(leftOverCards).concat(allNonMoneyCards).map(markCard)

      return `${payer} paid ${payee} $${dueAmount}M with ${allCards.join(' ')}`
    }
  }

  _pickUpCards (player: Player, game: Game, emptyHand: boolean = false): CardKey[] {
    if (!game.availableCards) {
      throw new Error('No available cards')
    }

    if (game.availableCards.length < 2 || (emptyHand && game.availableCards.length < 5)) {
      game.availableCards = newDeck()
    }

    if (!emptyHand) {
      const [first, second, ...rest] = game.availableCards
      game.availableCards = rest
      return [first, second]
    }

    const [first, second, third, fourth, fifth, ...rest] = game.availableCards

    game.availableCards = rest

    return [first, second, third, fourth, fifth]
  }
}
