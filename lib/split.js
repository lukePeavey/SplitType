import toArray from './utils/toArray'
import splitWordsAndChars from './splitWordsAndChars'
import * as data from './Data'

/**
 * Splits the text content of a target element into words and/or characters.
 * The function is recursive, it will also split the text content of any child
 * elements into words/characters, while preserving the nested elements.
 *
 * @param {Node} node an HTML Element or Text Node
 * @param {Object} setting splitType settings
 */
export default function split(node, settings) {
  const type = node.nodeType
  // Arrays of split words and characters
  const wordsAndChars = { words: [], chars: [] }

  // Only proceed if `node` is an `Element`, `Fragment`, or `Text`
  if (!/(1|3|11)/.test(type)) {
    return wordsAndChars
  }

  // A) IF `node` is TextNode that contains characters other than white space...
  //    Split the text content of the node into words and/or characters
  //    return an object containing the split word and character elements
  if (type === 3 && /\S/.test(node.nodeValue)) {
    return splitWordsAndChars(node, settings)
  }

  // B) ELSE `node` is an 'Element'
  //    Iterate through its child nodes, calling the `split` function
  //    recursively for each child node.
  const childNodes = toArray(node.childNodes)

  if (childNodes.length) {
    data.set(node, 'isSplit', true)
    // we need to set a few styles on nested html elements
    if (!data.get(node).isRoot) {
      node.style.display = 'inline-block'
      node.style.position = 'relative'
      // To maintain original spacing around nested elements when we are
      // splitting text into lines, we need to check if the element should
      // have a space before and after, and store that value for later.
      // Note: this was necessary to maintain the correct spacing when nested
      // elements do not align with word boundaries. For example, a nested
      // element only wraps part of a word.
      const nextSibling = node.nextSibling
      const prevSibling = node.previousSibling
      const text = node.textContent || ''
      const textAfter = nextSibling ? nextSibling.textContent : ' '
      const textBefore = prevSibling ? prevSibling.textContent : ' '
      data.set(node, {
        isWordEnd: /\s$/.test(text) || /^\s/.test(textAfter),
        isWordStart: /^\s/.test(text) || /\s$/.test(textBefore),
      })
    }
  }

  // Iterate through child nodes, calling `split` recursively
  // Returns an object containing all split words and chars
  return childNodes.reduce((result, child) => {
    const { words, chars } = split(child, settings)
    return {
      words: [...result.words, ...words],
      chars: [...result.chars, ...chars],
    }
  }, wordsAndChars)
}
