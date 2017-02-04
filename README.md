3REE Monopoly Deal
===================

[![CircleCI](https://circleci.com/gh/baopham/3ree-monopoly-deal.svg?style=svg)](https://circleci.com/gh/baopham/3ree-monopoly-deal)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)  

A WIP POC to test the 3REE (React - Redux - Rethinkdb - Express) stack.

> Initial boilerplate was based on: https://github.com/GordyD/3ree


Requirements
------------
* Node 6.7 and up
* npm 3.10 and up or yarn


Quick Start
----------

> Replace `npm` with `yarn` if you are using yarn

1. Install rethinkdb
1. Run `npm install`
1. Run `rethinkdb` in the root directory in a separate tab
1. Run `npm run db:setup` wait and exit
1. Run `npm start`


Notes
-----

- Currently, only the client knows about what cards the player is holding
- Rules are loosely applied
- If you get unexpected errors, try to clear local storage: `localStorage.removeItem('redux')`
- No authentication and such, play responsibly :blush:


TODOs
-----

- [x] Improve log - show card images for example
- [x] Allow to sly deal, force deal, pay "left over cards"
- [x] Say no to
  - [x] sly deal
  - [x] forced deal
  - [x] deal breaker
  - [x] payment (birthday, debt collector, rent)
  - [x] say no
- [x] Fix bug when paying using properties / house / hotel...
- [x] There should be a place for cards like house and hotel  
      e.g. payer pays using a property card -> set is no longer a full set -> house and hotel cards should go to a different place
- [x] Allow player to indicate if cards should be treated as money
- [x] Collect all the card images
- [x] Sound notification for payment notice
- [x] Game history log
- [x] Show who played the last card
- [x] Action counter
- [x] Draw cards on PASS GO
- [x] End turn when action counter reaches 3
- [x] Winner notification
- [x] Modal allows background scrolling
- [x] Use flow types in React components
- [x] Allow player to move wildcard to a particular property group
- [x] Allow player to flip card
- [x] Allow player to select which set the wildcard, house, or hotel card should go to (when these cards are still in hand)
- [x] Player can minimize the modal
- [x] Handle actions that require other players' responses
  - [x] Payment: payers get a form to select cards
  - [x] Payment: payee should not be able to do any other actions until all the payers pay their due
  - [x] Payment: handle when the payer does not have enough money to pay
  - [x] Payment: rent
  - [x] Payment: target rent
  - [x] Debt collector
- [x] Deal breaker
- [x] Sly deal
- [x] Forced deal
- [x] Double rent
- [x] House
- [x] Hotel
- [x] Draw 5 cards when hand is empty
- [ ] Fix HMR errors
- [x] Improve notification... possibly throttled?
- [ ] ~~Hydrate store from server~~


License
--------
MIT
