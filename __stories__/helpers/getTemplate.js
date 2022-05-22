import SplitType from '../../lib'

/**
 * Creates the Template function used for storybook examples.
 * It takes an object containing default arguments that will be passed
 * into the story template and merged with the story arguments.
 *
 * The template renders one or more elements and calls splitType
 * on those elements.
 *
 * Arguments
 * - `children` is the HTML content of the element(s). If this is an array,
 *    multiple elements will be rendered
 * - `className` applied to the elements
 * - `...args` all other arguments are assumed to be SplitType options. These
 *   are passed into the SplitType function.
 */
export default function getTemplate(defaultArgs = {}) {
  return (args) => {
    const { children, className = '', ...options } = { ...defaultArgs, ...args }
    const element = document.createElement('div')
    if (Array.isArray(children)) {
      element.className = `container ${className}`.trim()
      children.forEach((child) => {
        const elementHTML = `<div class="target">${child}</div>`
        element.insertAdjacentHTML('beforeend', elementHTML)
      })
    } else {
      element.className = `target ${className}`.trim()
      element.innerHTML = children
    }
    // For storybook controls...
    if (options.types === 'none') {
      options.types = ''
    }
    window.setTimeout(() => SplitType.create('.target', options), 1)
    return element
  }
}
