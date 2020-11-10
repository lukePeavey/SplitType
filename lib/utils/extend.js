/**
 * Shallow merges the properties of an object with the target object. Only
 * includes properties that exist on the target object. Non-writable properties
 * on the target object will not be over-written.
 *
 * @param {Object} target
 * @param {Object} object
 */
export default function extend(target, object) {
  return Object.getOwnPropertyNames(Object(target)).reduce((extended, key) => {
    const currentValue = Object.getOwnPropertyDescriptor(Object(target), key)
    const newValue = Object.getOwnPropertyDescriptor(Object(object), key)
    return Object.defineProperty(extended, key, newValue || currentValue)
  }, {})
}
