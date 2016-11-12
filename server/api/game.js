// TODO

function handleError (err, res) {
  console.error(err)
  res.status(400)
  res.json({ error: err })
}

export function drawCards (req, res) {
  res.json({
    cards: ['DEAL_BREAKER', 'PROPERTY_BLUE']
  })
}

export function discardCard (req, res) {
  res.json()
}

export function placeCard (req, res) {
  res.json()
}

export function giveCardToOtherMember (req, res) {
  res.json()
}
