import toArray from './toArray'
import isString from './isString'

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
    const rawValue = attributes[attribute]
    const value = isString(rawValue) ? rawValue.trim() : rawValue
    // Ignore attribute if the value is `null` or an empty string
    if (value === null || value === '') return
    if (attribute === 'children') {
      // Children can be one or more Elements or DOM strings
      element.append(...toArray(value))
    } else {
      // Handle standard HTML attributes
      element.setAttribute(attribute, value)
    }
  })
  return element
}
