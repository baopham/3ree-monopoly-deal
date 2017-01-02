/* @flow */
export default class ModelNotFound extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'ModelNotFound'
  }
}
