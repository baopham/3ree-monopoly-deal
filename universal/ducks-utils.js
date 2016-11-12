import merge from 'lodash/mergewith'

const serverUrl = ''
export const apiUrl = `${serverUrl}/api/v1`

export function namespace (namespace, value) {
  return `${namespace}/${value}`
}

export function deepmerge (original, next) {
  return merge({}, original, next, customizer)
}

function customizer (destValue, srcValue, key, destParent) {
  if (srcValue === undefined) {
    delete destParent[key]
  } else if (destValue instanceof Array && srcValue instanceof Array) {
    if (destValue.length !== srcValue.length) {
      return srcValue
    }
  }
}

