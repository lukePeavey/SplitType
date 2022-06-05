import isString from './isString'
import isNode from './isNode'
import toArray from './toArray'

/**
 * Processes target elements for the splitType function.
 *
 * @param {any} target Can be one of the following:
 * 1. `string` - A css selector
 * 2. `HTMLElement` - A single element
 * 3. `NodeList` - A nodeList
 * 4. `Element[]` - An array of elements
 * 5. `Array<NodeList|Element[]>` - An nested array of elements
 * @returns {Element[]} A flat array HTML elements
 * @return A flat array of elements or empty array if no elements are found
 */
export default function getTargetElements(target) {
  let elements = target
  // If `target` is a selector string...
  if (isString(target)) {
    if (/^(#[a-z]\w+)$/.test(target.trim())) {
      // If `target` is an ID, use `getElementById`
      elements = document.getElementById(target.trim().slice(1))
    } else {
      // Else use `querySelectorAll`
      elements = document.querySelectorAll(target)
    }
  }
  // Return a flattened array of elements
  return toArray(elements).reduce((result, element) => {
    return [...result, ...toArray(element).filter(isNode)]
  }, [])
}
