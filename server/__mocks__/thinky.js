/* @flow */
/* eslint-env jest */

const mockThinkyFn = jest.fn(() => ({ default: jest.fn() }))

export default {
  createModel: jest.fn(() => ({
    ensureIndex: jest.fn(),
    belongsTo: jest.fn(),
    hasMany: jest.fn(),
    getTableName: jest.fn()
  })),
  r: {
    now: jest.fn()
  },
  type: {
    number: mockThinkyFn,
    string: mockThinkyFn,
    object: mockThinkyFn,
    date: mockThinkyFn,
    array: mockThinkyFn
  }
}
