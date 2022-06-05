import isObject from './isObject'

/**
 * Returns true if `input` is one of the following:
 * - `Element`
 * - `Text`
 * - `DocumentFragment`
 */
export default function isNode(input) {
  return isObject(input) && /^(1|3|11)$/.test(input.nodeType)
}
