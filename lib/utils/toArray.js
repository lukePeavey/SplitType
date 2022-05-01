import isArrayLike from './isArrayLike'
import isArray from './isArray'

/**
 * Coerces `value` to an `Array`.
 *
 * @param {any} value
 * @return {any[]}
 * @example
 * // If `value` is any `Array`, returns original `Array`
 * let arr = [1, 2]
 * toArray(arr)
 * // => arr
 *
 * // If `value` is an `ArrayLike`, its equivalent to `Array.from(value)`
 * let nodeList = document.querySelectorAll('div')
 * toArray(nodeList)
 * // => HTMLElement[] s
 *
 * // If value is falsy, returns empty array
 * toArray(null)
 * // => []
 *
 * // For any other type of value, its equivalent to `Array.of(value)`
 * let element = document.createElement('div')
 * toArray(element)
 * // => [element]
 *
 */
export default function toArray(value) {
  if (isArray(value)) return value
  if (value == null) return []
  return isArrayLike(value) ? Array.prototype.slice.call(value) : [value]
}
