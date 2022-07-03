import isObject from './utils/isObject'
import { entries } from './utils/object'

export const expando = `_splittype`
export const cache = {}
let uid = 0

/**
 * Stores data associated with DOM elements or other objects. This is a
 * simplified version of jQuery's data method.
 *
 * @signature Data(owner)
 * @description Get the data store object for the given owner.
 * @param {Object} owner the object that data will be associated with.
 * @return {Object} the data object for given `owner`. If no data exists
 *     for the given object, creates a new data store and returns it.
 *
 * @signature Data(owner, key)
 * @description Get the value
 * @param {Object} owner
 * @param {string} key
 * @return {any} the value of the provided key. If key does not exist, returns
 *     undefined.
 *
 * @signature Data(owner, key, value)
 * @description Sets the given key/value pair in data store
 * @param {Object} owner
 * @param {string} key
 * @param {any} value
 */
export function set(owner, key, value) {
  if (!isObject(owner)) {
    console.warn('[data.set] owner is not an object')
    return null
  }
  const id = owner[expando] || (owner[expando] = ++uid)
  const data = cache[id] || (cache[id] = {})

  if (value === undefined) {
    if (!!key && Object.getPrototypeOf(key) === Object.prototype) {
      cache[id] = { ...data, ...key }
    }
  } else if (key !== undefined) {
    data[key] = value
  }
  return value
}

export function get(owner, key) {
  const id = isObject(owner) ? owner[expando] : null
  const data = (id && cache[id]) || {}
  if (key === undefined) {
    return data
  }
  return data[key]
}

/**
 * Remove all data associated with the given element
 */
export function remove(element) {
  const id = element && element[expando]
  if (id) {
    delete element[id]
    delete cache[id]
  }
}

/**
 * Remove all temporary data from the store.
 */
export function cleanup() {
  entries(cache).forEach(([id, { isRoot, isSplit }]) => {
    if (!isRoot || !isSplit) {
      cache[id] = null
      delete cache[id]
    }
  })
}
