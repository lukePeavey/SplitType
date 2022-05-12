import toArray from './utils/toArray'
import splitWordsAndChars from './splitWordsAndChars'
import { Data } from './Data'

/**
 * @param {Node} element an HTML Element or Text Node
 * @param {Object} setting splitType settings
 */
export default function split(element, settings) {
  // -> A) If `element` is a text node...
  //    Split the text content of the node into words and/or characters
  //    returns an object containing the split word and characters
  if (element.nodeType === 3) {
    return splitWordsAndChars(element, settings)
  }

  // -> B) if not, element is an HTML element or fragment
  //    We will iterate through the child nodes of the element,
  //    calling the `split` function recursively for each child.
  const childNodes = toArray(element.childNodes)

  if (childNodes.length) {
    Data(element).isSplit = true
    // we need to set a few styles on custom html elements inside
    // the root element.
    if (!Data(element).isRoot) {
      element.style.display = 'inline-block'
      element.style.position = 'static'
    }
  }

  // Iterate through child nodes, calling `split` recursively
  // Returns an object containing all split words and chars
  const wordsAndChars = childNodes.reduce((result, child) => {
    const { words, chars } = split(child, settings)
    return {
      words: [...toArray(result.words), ...toArray(words)],
      chars: [...toArray(result.chars), ...toArray(chars)],
    }
  }, {})

  return wordsAndChars
}
