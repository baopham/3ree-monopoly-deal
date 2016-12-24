type Player = {
  id: string,
  username: Username,
  gameId: string,
  actionCounter: number,
  placedCards: PlacedCards,
  propertySets: SerializedPropertySets[],
  game: Game,
  payeeInfo: PayeeInfo,
  save: Function,
  saveAll: Function
}
