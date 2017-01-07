/* @flow */
import request from 'axios'

export function get (url: string, query?: Object): Promise<*> {
  return request
    .get(url, { params: query })
    .then(returnData)
}

export function post (url: string, payload?: Object): Promise<*> {
  return request
    .post(url, payload)
    .then(returnData)
}

export function put (url: string, payload?: Object): Promise<*> {
  return request
    .put(url, payload)
    .then(returnData)
}

export function mapToJSON (map: Map<*, *>) {
  return JSON.stringify(Array.from(map))
}

export function jsonToMap (json: string): Map<*, *> {
  return new Map(JSON.parse(json))
}

function returnData (response) {
  return response.data
}
