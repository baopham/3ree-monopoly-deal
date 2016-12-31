/* @flow */
import PlayerRepository from '../../repositories/PlayerRepository'
import GameService from '../GameService'
import GameHistoryService from '../GameHistoryService'
import * as monopoly from '../../../universal/monopoly/monopoly'
import PropertySet from '../../../universal/monopoly/PropertySet'
import type { PropertySetId } from '../../../universal/monopoly/PropertySet'

export default class PlayerPlacedCardService {
  playerRepository: PlayerRepository
  gameService: GameService
  gameHistoryService: GameHistoryService

  constructor () {
    this.playerRepository = new PlayerRepository()
    this.gameService = new GameService()
    this.gameHistoryService = new GameHistoryService()
  }

  flipPlacedCard (
    gameId: string, username: Username, cardKey: CardKey, propertySetId: PropertySetId
  ): Promise<CardKey> {
    if (!monopoly.canFlipCard(cardKey)) {
      return Promise.reject(`Cannot flip ${cardKey}`)
    }

    const flippedCardKey: CardKey = monopoly.flipCard(cardKey)

    return this.playerRepository.findByGameIdAndUsername(gameId, username)
      .then((player: Player) => {
        const setToUpdateIndex = player.placedCards.serializedPropertySets
          .findIndex(set => monopoly.unserializePropertySet(set).getId() === propertySetId)

        if (setToUpdateIndex === -1) {
          return Promise.reject(`Cannot find the set with id ${propertySetId}`)
        }

        const setToUpdate = player.placedCards.serializedPropertySets[setToUpdateIndex]
        const cardIndex = setToUpdate.cards.findIndex(c => c === cardKey)

        // Update in place
        setToUpdate.cards.splice(cardIndex, 1)
        const newSet = new PropertySet(monopoly.getPropertySetIdentifier(flippedCardKey), [flippedCardKey])
        player.placedCards.serializedPropertySets.push(newSet.serialize())

        if (!setToUpdate.cards.length) {
          player.placedCards.serializedPropertySets.splice(setToUpdateIndex, 1)
        }

        player.actionCounter += 1

        return Promise.all([
          player.save(),
          this.gameHistoryService.record(gameId, `${username} flipped ${cardKey}`)
        ])
      })
      .then(() => flippedCardKey)
  }

  flipPlacedLeftOverCard (
    gameId: string, username: Username, cardKey: CardKey
  ): Promise<CardKey> {
    if (!monopoly.canFlipCard(cardKey)) {
      return Promise.reject(`Cannot flip ${cardKey}`)
    }

    const flippedCardKey: CardKey = monopoly.flipCard(cardKey)

    return this.playerRepository.findByGameIdAndUsername(gameId, username)
      .then((player: Player) => {
        const cardIndex = player.placedCards.leftOverCards.findIndex(c => c === cardKey)

        if (cardIndex === -1) {
          return Promise.reject(`Cannot find the card ${cardKey} in the left over list`)
        }

        // Update in place
        player.placedCards.leftOverCards[cardIndex] = flippedCardKey
        player.actionCounter += 1

        return Promise.all([
          player.save(),
          this.gameHistoryService.record(gameId, `${username} flipped ${cardKey}`)
        ])
      })
      .then(() => flippedCardKey)
  }

  movePlacedCard (
    gameId: string, username: Username, cardKey: CardKey, fromSetId: PropertySetId, toSetId: PropertySetId
  ): Promise<*> {
    return this.playerRepository.findByGameIdAndUsername(gameId, username)
      .then((player: Player) => {
        const mapOfSetIndexes: Map<PropertySetId, number> = new Map()

        player.placedCards.serializedPropertySets.forEach((set, index) => {
          mapOfSetIndexes.set(monopoly.unserializePropertySet(set).getId(), index)
        })

        const fromSetIndex = mapOfSetIndexes.get(fromSetId)
        const toSetIndex = mapOfSetIndexes.get(toSetId)

        if (fromSetIndex === undefined || toSetIndex === undefined) {
          return Promise.reject(`Cannot find sets: ${fromSetId}, ${toSetId}`)
        }

        const fromSet = player.placedCards.serializedPropertySets[fromSetIndex]
        const toSet = player.placedCards.serializedPropertySets[toSetIndex]

        // Validate the move
        if (!monopoly.unserializePropertySet(toSet).canAddCard(cardKey)) {
          return Promise.reject(`Cannot move card ${cardKey} to ${toSetId}`)
        }

        // Update in place
        const indexToRemove = fromSet.cards.findIndex(c => c === cardKey)
        fromSet.cards.splice(indexToRemove, 1)
        toSet.cards.push(cardKey)

        // After moving, if the set is empty, remove it completely
        if (!fromSet.cards.length) {
          player.placedCards.serializedPropertySets.splice(fromSetIndex, 1)
        }

        player.actionCounter += 1

        return Promise.all([
          player.save(),
          this.gameHistoryService.record(gameId, `${username} moved ${cardKey} to another set`)
        ])
      })
  }

  movePlacedLeftOverCard (
    gameId: string, username: Username, cardKey: CardKey, toSetId: PropertySetId
  ): Promise<*> {
    return this.playerRepository.findByGameIdAndUsername(gameId, username)
      .then((player: Player) => {
        const toSet = player.placedCards.serializedPropertySets.find(
          set => monopoly.unserializePropertySet(set).getId() === toSetId
        )

        if (!toSet) {
          return Promise.reject(`Cannot find set: ${toSetId}`)
        }

        // Validate the move
        if (!monopoly.unserializePropertySet(toSet).canAddCard(cardKey)) {
          return Promise.reject(`Cannot move card ${cardKey} to ${toSetId}`)
        }

        // Update in place
        const indexToRemoveFromLeftOver = player.placedCards.leftOverCards.findIndex(c => c === cardKey)
        player.placedCards.leftOverCards.splice(indexToRemoveFromLeftOver, 1)
        toSet.cards.push(cardKey)
        player.actionCounter += 1

        return Promise.all([
          player.save(),
          this.gameHistoryService.record(gameId, `${username} moved ${cardKey} to another set`)
        ])
      })
  }

}
