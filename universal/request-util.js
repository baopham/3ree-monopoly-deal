import request from 'superagent'

export function get (url, query) {
  return request
    .get(url)
    .query(query)
    .set('Accept', 'application/json')
}

export function post (url, payload) {
  return request
    .post(url)
    .send(payload)
    .set('Accept', 'application/json')
}
