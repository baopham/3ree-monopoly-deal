import { namespace, deepmerge, apiUrl } from '../../../ducks-utils'
import * as request from '../../../request-util'

function ns (value) {
  return namespace('PLAYER', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const DRAW_CARD = ns('DRAW_CARD')
const DISCARD_CARD = ns('DISCARD_CARD')
const PLACE_CARD = ns('PLACE_CARD')
const GIVE_CARD_TO_OTHER_MEMBER_SUCCESS = ns('GIVE_CARD_TO_OTHER_MEMBER_SUCCESS')

// ------------------------------------
// Actions
// ------------------------------------
function drawCard (card) {
  // TODO
}

function discardCard (card) {
  // TODO
}

function placeCard (card) {
  // TODO
}

function giveCardToOtherMember (card, username) {
  // TODO
}
