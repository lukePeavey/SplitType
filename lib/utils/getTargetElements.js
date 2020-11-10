import isNode from './isNode'
import isString from './isString'
import flatten from './flatten'

/**
 * Processes target elements for the splitType function. `target` can any
 * of the following types.
 * 1. `string` - A css selector
 * 2. `HTMLElement` - A single element
 * 3. `ArrayLike<HTMLElement>` - A collection of elements (ie NodeList)
 * 4. `Array<HTMLElement | ArrayLike<HTMLElement>>` - An array of elements
 *     and/or collections of elements
 *
 * Returns a flat array of HTML elements. If `target` does not contain any
 * valid elements, returns an empty array.
 *
 * @param {any} target
 * @returns {HTMLElement[]} A flat array HTML elements
 * @example
 *
 * // Single Element
 * const element = document.createElement('div')
 * getTargetElements()
 * // => [element]
 *
 * const nodeList = document.querySelectorAll('div')
 * getTargetElements(nodeList)
 * // => HTMLElement[] (all elements in `nodeList`)
 *
 * const nodeListA = document.querySelectorAll('div')
 * const nodeListB = document.querySelectorAll('p')
 * getTargetElements([nodeListA, nodeListB])
 * // => HTMLElement[] (all elements in `nodeListA` and `nodeListB`)
 *
 * // ID selector
 * getTargetElements('#id')
 * // => HTMLElement[]
 *
 * // Class selector
 * getTargetElements('.text')
 * // => HTMLElement[]
 *
 * // Non element object will not be returned
 * getTargetElements({foo: bar})
 * // => []
 *
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
  return flatten(elements).filter(isNode)
}
