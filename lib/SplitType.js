import extend from './utils/extend'
import parseSettings from './utils/parseSettings'
import parseTypes from './utils/parseTypes'
import toArray from './utils/toArray'
import getTargetElements from './utils/getTargetElements'
import { Data, RemoveData } from './Data'
import split from './split'
import repositionAfterSplit from './repositionAfterSplit'
import defaults from './defaults'

// Default Settings for `SplitType` instances
let _defaults = extend(defaults, {})

export default class SplitType {
  /**
   * The default settings for all splitType instances
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
   * @example
   * SplitType.setDefaults({ "position": "absolute" })
   */
  static setDefaults(options) {
    _defaults = extend(_defaults, parseSettings(options))
    return defaults
  }

  /**
   * A static method to revert the target elements.
   * This provides a way to revert elements without having a reference to the
   * SplitType instance.
   */
  static revert(target) {
    const elements = getTargetElements(target)
    elements.forEach((element) => {
      const { isSplit, html } = Data(element)
      if (isSplit) {
        element.innerHTML = html || ''
        Data(element).isSplit = false
        Data(element).html = null
      }
    })
  }

  /**
   * Creates a new SplitType instance with the given parameters
   * This static method provides a way to create a splitType instance without
   * using the new keyword.
   *
   * @param {any} target The target elements to split. can be one of:
   *  - {string} A css selector
   *  - {HTMLElement} A single element
   *  - {ArrayLike<HTMLElement>} A collection of elements
   *  - {Array<HTMLElement | ArrayLike<HTMLElement>>} A nested array of elements
   * @param {Object} [options] Settings for the SplitType instance
   * @return {SplitType} the SplitType instance
   */
  static create(target, options) {
    return new SplitType(target, options)
  }

  /**
   * Creates a new `SplitType` instance
   *
   * @param {any} target The target elements to split. can be one of:
   *  - {string} A css selector
   *  - {HTMLElement} A single element
   *  - {ArrayLike<HTMLElement>} A collection of elements
   *  - {Array<HTMLElement | ArrayLike<HTMLElement>>} A nested array of elements
   * @param {Object} [options] Settings for the SplitType instance
   */
  constructor(target, options) {
    this.isSplit = false
    this.settings = extend(_defaults, parseSettings(options))
    this.elements = getTargetElements(target) || []

    this.revert()

    this.elements.forEach((element) => {
      // Store original html content of each target element
      Data(element).html = element.innerHTML
      Data(element).inlineStyles = element.getAttribute('style')
    })
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
    // Revert elements if they are already split
    this.revert()

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
      Data(element).isRoot = true
      // const copy = element.cloneNode(true)
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

    // Clear data cache
    this.elements.forEach((element) => {
      // Deletes cached data for nodes within the target element.
      // Does not remove data stored on the target element itself.
      toArray(Data(element).nodes).forEach(RemoveData)
      Data(element).nodes = null
    })
  }

  /**
   * Reverts target element(s) back to their original html content
   * @public
   */
  revert() {
    // restore original HTML content
    // Note: this will revert the target elements even if they were split by a
    // different splitType instance.
    this.elements.forEach((element) => {
      const { isSplit, html, inlineStyle = '' } = Data(element)
      if (isSplit) {
        element.innerHTML = html
        element.setAttribute('style', inlineStyle)
        Data(element).isSplit = false
      }
    })

    // Reset instance properties if necessary
    if (this.isSplit) {
      this.lines = null
      this.words = null
      this.chars = null
      this.isSplit = false
    }
  }
}
