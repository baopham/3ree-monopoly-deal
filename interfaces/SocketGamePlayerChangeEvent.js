type SocketGamePlayerChangeEvent = {
  created: boolean,
  deleted: boolean,
  updated: boolean,
  payeeInfoUpdated: boolean,
  new_val: ?Player,
  old_val: ?Player
}
