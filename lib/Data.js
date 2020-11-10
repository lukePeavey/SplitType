import isObject from './utils/isObject'

/**
 * Stores data associated with DOM elements. This is a simplified version of
 * jQuery's data method.
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
