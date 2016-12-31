type GameHistoryRecord = {
  id: string,
  gameId: string,
  message: string,
  playersToNotify: Username[],
  createdAt: string
}
