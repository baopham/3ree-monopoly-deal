/* @flow */
import merge from 'lodash/mergeWith'

const serverUrl = ''
export const apiUrl = `${serverUrl}/api/v1`

export function namespace (namespace: string, value: string): string {
  return `${namespace}/${value}`
}

export function keyMirror (obj: Object): Object {
  const newObject = {}

  let key: string

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObject[key] = key
    }
  }

  return newObject
}

export function deepmerge (original: Object, next?: Object): Object {
  return merge({}, original, next, customizer)
}

function customizer (destValue: Object, srcValue: mixed, key: string, destParent: Object) {
  if (srcValue === undefined) {
    delete destParent[key]
  } else if (destValue instanceof Array && srcValue instanceof Array) {
    if (destValue.length !== srcValue.length) {
      return srcValue
    }
  }
}
