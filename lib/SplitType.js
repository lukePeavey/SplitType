import extend from './utils/extend'
import parseSettings from './utils/parseSettings'
import parseTypes from './utils/parseTypes'
import getTargetElements from './utils/getTargetElements'
import * as data from './Data'
import split from './split'
import repositionAfterSplit from './repositionAfterSplit'
import defaults from './defaults'

// Default Settings for `SplitType` instances
let _defaults = extend(defaults, {})

export default class SplitType {
  /**
   * The internal data store
   */
  static get data() {
    return data.cache
  }

  /**
   * CLears all data
   */
  static clearData() {
    data.clear()
  }

  /**
   * The default settings for all splitType instances
   * @static
   */
  static get defaults() {
    return _defaults
  }

  /**
   * Sets the default settings for all SplitType instances.
   *
   * Setting `SplitType.defaults` to an object will merge that object with the
   * existing defaults.
   *
   * @param {Object} settings an object containing the settings to override
   * @deprecated
   * @static
   * @example
   * SplitType.defaults = { "position": "absolute" }
   */
  static set defaults(options) {
    _defaults = extend(_defaults, parseSettings(options))
  }

  /**
   * Sets the default settings for all SplitType instances.
   * The provided object will be merged with the existing defaults objects.
   *
   * @param {Object} settings an object containing the settings to override
   * @returns {Object} the new default settings
   * @public
   * @static
   * @example
   * SplitType.setDefaults({ "position": "absolute" })
   */
  static setDefaults(options) {
    _defaults = extend(_defaults, parseSettings(options))
    return defaults
  }

  /**
   * Revert target elements to their original html content
   * Has no effect on that
   *
   * @param {any} elements The target elements to revert. One of:
   *  - {string} A css selector
   *  - {HTMLElement} A single element
   * -  {NodeList} A NodeList or collection
   *  - {HTMLElement[]} An array of Elements
   * -  {Array<HTMLElement|NodeList|HTMLElement[]>} A nested array of elements
   * @static
   */
  static revert(elements) {
    getTargetElements(elements).forEach((element) => {
      const { isSplit, html, cssWidth, cssHeight } = data.get(element)
      if (isSplit) {
        element.innerHTML = html
        element.style.width = cssWidth || ''
        element.style.height = cssHeight || ''
        data.remove(element)
      }
    })
  }

  /**
   * Creates a new SplitType instance
   * This static method provides a way to create a `SplitType` instance without
   * using the `new` keyword.
   *
   * @param {any} target The target elements to split. One of:
   *  - {string} A css selector
   *  - {HTMLElement} A single element
   * -  {NodeList} A NodeList or collection
   *  - {HTMLElement[]} An array of Elements
   * -  {Array<HTMLElement|NodeList|HTMLElement[]>} A nested array of elements
   * @param {Object} [options] Settings for the SplitType instance
   * @return {SplitType} the SplitType instance
   * @static
   */
  static create(target, options) {
    return new SplitType(target, options)
  }

  /**
   * Creates a new `SplitType` instance
   *
   * @param {any} elements The target elements to split. One of:
   *  - {string} A css selector
   *  - {HTMLElement} A single element
   * -  {NodeList} A NodeList or collection
   *  - {HTMLElement[]} An array of Elements
   * -  {Array<HTMLElement|NodeList|HTMLElement[]>} A nested array of elements
   * @param {Object} [options] Settings for the SplitType instance
   */
  constructor(elements, options) {
    this.isSplit = false
    this.settings = extend(_defaults, parseSettings(options))
    this.elements = getTargetElements(elements)
    // Start the split process
    this.split()
  }

  /**
   * Splits the text in all target elements. This method is called
   * automatically when a new SplitType instance is created. It can also be
   * called manually to re-split text with new options.
   * @param {Object} options
   * @public
   */
  split(options) {
    // Revert target elements (if they are already split)
    // Note: revert was already called once in the constructor. However, we
    // need to call it again here so text is reverted when the user manually
    // calls the `split` method to re-split text.
    this.revert()

    // Store the original html content of each target element
    this.elements.forEach((element) => {
      data.set(element, 'html', element.innerHTML)
    })

    // Create arrays to hold the split lines, words, and characters
    this.lines = []
    this.words = []
    this.chars = []

    // cache vertical scroll position before splitting
    const scrollPos = [window.pageXOffset, window.pageYOffset]

    // If new options were passed into the `split()` method, update settings
    if (options !== undefined) {
      this.settings = extend(this.settings, parseSettings(options))
    }
    const types = parseTypes(this.settings.types)

    // If the `types` option is set to an empty array, text will not be split.
    // @example new SplitType('#target', { types: [] })
    if (types.none) {
      return
    }

    // Split text in each target element
    this.elements.forEach((element) => {
      // Add the split text nodes from this element to the arrays of all split
      // text nodes for this instance.
      data.set(element, 'isRoot', true)
      const { words, chars } = split(element, this.settings)
      this.words = [...this.words, ...words]
      this.chars = [...this.chars, ...chars]
    })

    this.elements.forEach((element) => {
      if (types.lines || this.settings.absolute) {
        const lines = repositionAfterSplit(element, this.settings, scrollPos)
        this.lines = [...this.lines, ...lines]
      }
    })

    // Set isSplit to true for the SplitType instance
    this.isSplit = true
    // Set scroll position to cached value.
    window.scrollTo(scrollPos[0], scrollPos[1])
    // Clean up stored data
    data.cleanup()
  }

  /**
   * Reverts target element(s) back to their original html content
   * Deletes all stored data associated with the target elements
   * Resets the properties on the splitType instance
   *
   * @public
   */
  revert() {
    if (this.isSplit) {
      // Reset instance properties if necessary
      this.lines = null
      this.words = null
      this.chars = null
      this.isSplit = false
    }
    SplitType.revert(this.elements)
  }
}
