type GameHistoryRecord = {
  id: string,
  gameId: string,
  message: string,
  notifyUsers: Username[],
  createdAt: string
}
