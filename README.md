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
- [ ] Rework on webpack for SCSS and CSS modules
- [ ] Draw 5 cards when hand is empty
- [ ] Handle actions that require other players' responses
