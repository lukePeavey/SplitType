import forEach from './forEach'
import isNode from './isNode'

/**
 * Create an HTML element with the the given attributes
 *
 * attributes can include standard HTML attribute, as well as the following
 * "special" properties:
 *   - children: HTMLElement | ArrayLike<HTMLElement>
 *   - textContent: string
 *   - innerHTML: string
 *
 * @param {string} name
 * @param  {Object} [attributes]
 * @returns {HTMLElement}
 */
export default function createElement(name, attributes) {
  const element = document.createElement(name)

  if (!attributes) {
    // When called without the second argument, its just return the result
    // of `document.createElement`
    return element
  }

  Object.keys(attributes).forEach((attribute) => {
    const value = attributes[attribute]
    // Ignore attribute if value is `null`
    if (value === null) return

    // Handle `textContent` and `innerHTML`
    if (attribute === 'textContent' || attribute === 'innerHTML') {
      element[attribute] = value
    }
    // Handle `children`
    else if (attribute === 'children') {
      forEach(value, (child) => {
        if (isNode(child)) element.appendChild(child)
      })
    }
    // Handle standard HTML attributes
    else {
      element.setAttribute(attribute, String(value).trim())
    }
  })
  return element
}
