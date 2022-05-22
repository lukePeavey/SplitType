import isObject from './utils/isObject'

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
export function Data(owner, key, value) {
  let data = {}
  let id = null

  if (isObject(owner)) {
    id = owner[Data.expando] || (owner[Data.expando] = ++Data.uid)
    data = Data.cache[id] || (Data.cache[id] = {})
  }
  // Get data
  if (value === undefined) {
    if (key === undefined) {
      return data
    }
    return data[key]
  }
  // Set data
  else if (key !== undefined) {
    data[key] = value
    return value
  }
}

Data.expando = `splitType${new Date() * 1}`
Data.cache = {}
Data.uid = 0

// Remove all data associated with the given element
export function RemoveData(element) {
  const id = element && element[Data.expando]
  if (id) {
    delete element[id]
    delete Data.cache[id]
  }
}
