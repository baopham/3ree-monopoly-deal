type Player = {
  id: string,
  username: Username,
  gameId: string,
  actionCounter: number,
  placedCards: PlacedCards,
  game: Game,
  payeeInfo: PayeeInfo,
  leftOverCards: CardKey[],
  save: Function,
  saveAll: Function
}
