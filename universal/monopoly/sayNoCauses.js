/* @flow */
const causes = {
  PAYMENT: 'PAYMENT',
  SLY_DEAL: 'SLY_DEAL',
  FORCED_DEAL: 'FORCED_DEAL',
  DEAL_BREAKER: 'DEAL_BREAKER'
}

export type SayNoCause = $Keys<typeof causes>

export type SayNoToSlyDeal = {
  slyDealRequestId: string
}

export type SayNoToForcedDeal = {
  forcedDealRequestId: string
}

export type SayNoToDealBreaker = {
  dealBreakerRequestId: string
}

export type SayNoToPaymentRequest = {
  payer: Username,
  payee: Username
}

export type SayNoCauseInfo = SayNoToPaymentRequest | SayNoToSlyDeal | SayNoToForcedDeal | SayNoToDealBreaker | null

export { causes as default }
