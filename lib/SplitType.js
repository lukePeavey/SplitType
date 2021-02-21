import extend from './utils/extend'
import parseSettings from './utils/parseSettings'
import toArray from './utils/toArray'
import getTargetElements from './utils/getTargetElements'
import { Data, RemoveData } from './Data'
import split from './split'
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
   *
   * @example
   * SplitType.defaults = { "position": "absolute" }
   */
  static set defaults(options) {
    _defaults = extend(_defaults, parseSettings(options))
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

    if (this.elements.length) {
      // Store the original HTML content of each target element
      this.originals = this.elements.map((element) => {
        return Data(element, 'html', Data(element).html || element.innerHTML)
      })
      if (this.settings.types) {
        // Initiate the split operation.
        this.split()
      }
    }
  }

  /**
   * Splits the text in all target elements. This method is called
   * automatically when a new SplitType instance is created. It can also be
   * called manually to re-split text with new options.
   * @param {Object} options
   * @public
   */
  split(options) {
    // If any of the target elements have already been split,
    // revert them back to their original content before splitting them.
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

    // Split text in each target element
    this.elements.forEach((element) => {
      // Add the split text nodes from this element to the arrays of all split
      // text nodes for this instance.
      const { lines, words, chars } = split(element, this.settings)
      this.lines = this.lines.concat(lines)
      this.words = this.words.concat(words)
      this.chars = this.chars.concat(chars)
      Data(element).isSplit = true
    })

    // Set isSplit to true for the SplitType instance
    this.isSplit = true

    // Set scroll position to cached value.
    window.scrollTo(scrollPos[0], scrollPos[1])

    // Clear data Cache
    this.elements.forEach((element) => {
      const nodes = Data(element).nodes || []
      toArray(nodes).forEach(RemoveData)
    })
  }

  /**
   * Reverts target element(s) back to their original html content
   * @public
   */
  revert() {
    // Delete the arrays of split text elements
    if (this.isSplit) {
      this.lines = null
      this.words = null
      this.chars = null
    }

    // Remove split text from target elements and restore original content
    this.elements.forEach((element) => {
      if (Data(element).isSplit && Data(element).html) {
        element.innerHTML = Data(element).html
        element.style.height = Data(element).cssHeight || ''
        element.style.width = Data(element).cssWidth || ''
        this.isSplit = false
      }
    })
  }
}
