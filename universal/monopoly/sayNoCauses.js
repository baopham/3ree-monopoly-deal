/* @flow */
const causes = {
  PAYMENT: 'PAYMENT',
  SLY_DEAL: 'SLY_DEAL',
  FORCED_DEAL: 'FORCED_DEAL',
  DEAL_BREAKER: 'DEAL_BREAKER'
}

export type SayNoCause = $Keys<typeof causes>

export type SayNoCauseInfo = SayNoToPaymentRequest | null

export type SayNoToPaymentRequest = {
  payer: Username,
  payee: Username
}

export { causes as default }
