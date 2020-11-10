/**
 * Returns true if `value` is a non-null object.
 * @param {any} value
 * @return {boolean}
 */
export default function isObject(value) {
  return value !== null && typeof value === 'object'
}
