/* @flow */
import request from 'superagent'

export function get (url: string, query?: Object): Promise<*> {
  return request
    .get(url)
    .query(query)
    .set('Accept', 'application/json')
}

export function post (url: string, payload?: Object): Promise<*> {
  return request
    .post(url)
    .send(payload)
    .set('Accept', 'application/json')
}

export function put (url: string, payload?: Object): Promise<*> {
  return request
    .put(url)
    .send(payload)
    .set('Accept', 'application/json')
}

export function mapToJSON (map: Map<*, *>) {
  return JSON.stringify(Array.from(map))
}

export function jsonToMap (json: string): Map<*, *> {
  return new Map(JSON.parse(json))
}
