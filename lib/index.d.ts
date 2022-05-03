declare module 'split-type' {
  type TypesValue = 'lines' | 'words' | 'chars'
  type TypesListString =
    | TypesValue
    | `${TypesValue}, ${TypesValue}`
    | `${TypesValue}, ${TypesValue}, ${TypesValue}`

  type SplitTypeOptions = {
    absolute: boolean
    tagName: string
    lineClass: string
    wordClass: string
    charClass: string
    splitClass: string
    types: TypesListString | TypesValue[]
    split: TypesListString | TypesValue[]
  }

  type TargetElement =
    | string
    | HTMLElement
    | ArrayLike<HTMLElement>
    | Array<HTMLElement | ArrayLike<HTMLElement>>

  export default class SplitType {
    /**
     * An array of the split line elements in the splitType instance
     */
    lines: HTMLElement[] | null

    /**
     * An array of the split word elements in the splitType instance
     */
    words: HTMLElement[] | null

    /**
     * An array of the split character elements
     */
    chars: HTMLElement[] | null

    /**
     * Get the default settings for all SplitType calls, or set new ones.
     *
     * If setting: the value should be object containing specific settings to
     * override. The value will be merged with the existing defaults object.
     */
    static defaults: Partial<SplitTypeOptions>
    /**
     * Sets global defaults for all SplitType instances. The provided object
     * is merged with the existing settings.
     */
    static setDefaults(options: Partial<SplitTypeOptions>): SplitTypeOptions

    /**
     * Creates a new `SplitType` instance
     *
     * This static method provides a way to call `SplitType` without using the
     * new keyword.
     */
    static create(
      target: TargetElement,
      options?: Partial<SplitTypeOptions>
    ): SplitType

    /**
     * Creates a new `SplitType` instance
     *
     * @param target The target elements to split. can be one of:
     *  - {string} A css selector
     *  - {HTMLElement} A single element node
     *  - {ArrayLike<HTMLElement>} A collection of elements
     *  - {Array<HTMLElement | ArrayLike<HTMLElement>>} An array containing
     *    HTML elements and/or collections of HTML elements.
     * @param [options] Settings for the SplitType instance
     */
    constructor(target: TargetElement, options?: Partial<SplitTypeOptions>)

    /**
     * Splits the text in all target elements. This method is called
     * automatically when a new SplitType instance is created. It can also be
     * called manually to re-split text with new options.
     * @param options
     */
    split(options: Partial<SplitTypeOptions>): void

    /**
     * Restores target elements to their original text content. It also clears
     * cached data associated with the split text nodes.
     */
    revert(): void
  }
}
