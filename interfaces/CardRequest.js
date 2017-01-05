import type { CardRequestInfo, CardRequestType } from '../universal/monopoly/cardRequestTypes'

type CardRequest = {
  gameId: string,
  info: CardRequestInfo,
  type: CardRequestType,
  save: Function
}
