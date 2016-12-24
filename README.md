## 3REE Monopoly Deal

A WIP POC to test the 3REE (React - Redux - Rethinkdb - Express) stack.

> Initial boilerplate was based on: https://github.com/GordyD/3ree

### Quick Start

1. Install rethinkdb
1. Run `npm install`
1. Run `rethinkdb` in the root directory
1. Run `npm run db:setup`
1. Run `npm start`


### Notes

- Currently, only the client knows about what cards the player is holding
- Rules are loosely applied


### TODOs

- [ ] Collect all the card images
- [ ] Notification for each action
- [ ] Draw 5 cards when hand is empty
- [x] Show who played the last card
- [x] Action counter
- [x] Draw cards on PASS GO
- [x] End turn when action counter reaches 3
- [x] Winner notification
- [x] Modal allows background scrolling
- [x] Use flow types in React components
- [ ] Allow player to move wildcard to a particular property group
- [ ] Player can minimize the modal
- [ ] Handle actions that require other players' responses
  - [x] Payment: payers get a form to select cards
  - [x] Payment: payee should not be able to do any other actions until all the payers pay their due
  - [x] Payment: handle when the payer does not have enough money to pay
  - [x] Payment: rent
  - [ ] Payment: target rent
  - [ ] Sly deal
  - [ ] Forced deal
  - [ ] Deal breaker
- [ ] House
- [ ] Hotel
