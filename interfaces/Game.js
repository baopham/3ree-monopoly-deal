type Game = {
  id: string,
  name: string,
  winner: Username,
  discardedCards: CardKey[],
  availableCards: CardKey[],
  currentTurn: Username,
  players: Player[],
  updatedAt: string,
  createdAt: string,
  save: Function,
  saveAll: Function
}
