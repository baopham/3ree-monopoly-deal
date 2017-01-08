import type { CardRequestInfo, CardRequestType } from '../universal/monopoly/cardRequestTypes'

type CardRequest = {
  id: string,
  gameId: string,
  info: CardRequestInfo,
  type: CardRequestType,
  save: Function,
  delete: Function
}
