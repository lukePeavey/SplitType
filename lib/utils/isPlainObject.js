import isObject from './isObject'

/**
 * Checks if `value` is a "plain" object.
 * @param {any} value
 * @return {boolean} `true` if `value` is a "plain" object, else `false`
 */
export default function isPlainObject(value) {
  if (!isObject(value)) return false
  return Object.prototype.toString.call(value).slice(8, 14) === 'Object'
}
