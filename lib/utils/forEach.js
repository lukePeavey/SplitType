import toArray from './toArray'

/**
 * Iterates values of an array or array-like object calling the provided
 * `callback` for each item. Based on `array.forEach`
 * @param {any} collection
 * @param {function} callback
 */
export default function forEach(collection, callback) {
  const arr = toArray(collection)
  for (let len = arr.length, i = 0; i < len; i++) {
    callback(arr[i], i, arr)
  }
}
