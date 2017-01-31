/* @flow */
export function mapToJSON (map: Map<*, *>) {
  return JSON.stringify(Array.from(map))
}

export function jsonToMap (json: string): Map<*, *> {
  return new Map(JSON.parse(json))
}
