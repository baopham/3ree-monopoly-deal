/* @flow */
import type { PropertySetId } from './PropertySet'

const types = {
  SLY_DEAL: 'SLY_DEAL',
  FORCED_DEAL: 'FORCED_DEAL',
  DEAL_BREAKER: 'DEAL_BREAKER'
}

export type CardRequestType = $Keys<typeof types>

export type SlyDealInfo = {
  fromUser: Username,
  toUser: Username,
  setId: PropertySetId,
  card: CardKey
}

export type CardRequestInfo = SlyDealInfo | null

export { types as default }
