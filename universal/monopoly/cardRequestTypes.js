/* @flow */
const types = {
  SLY_DEAL: 'SLY_DEAL',
  FORCED_DEAL: 'FORCED_DEAL',
  DEAL_BREAKER: 'DEAL_BREAKER'
}

export type CardRequestType = $Keys<typeof types>

export { types as default }
