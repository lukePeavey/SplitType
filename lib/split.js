import toArray from './utils/toArray'
import splitWordsAndChars from './splitWordsAndChars'
import { Data } from './Data'

/**
 * @param {Node} element an HTML Element or Text Node
 * @param {Object} setting splitType settings
 */
export default function split(element, settings) {
  // -> If `element` is a text node
  //    Split the text content of `element` into words and/or characters
  if (element.nodeType === 3) {
    return splitWordsAndChars(element, settings)
  }

  // -> Otherwise iterate through the child nodes of element and
  //    call `split` recursively for each child
  const childNodes = toArray(element.childNodes)

  if (!Data(element).isRoot && childNodes.length) {
    // any custom html elements inside the target element have to set to
    // display inline block.
    // TODO: flexbox
    element.style.display = 'inline-block'
  }

  // Iterate through child nodes
  childNodes.forEach((child) => {
    // -> A) Child IS NOT a text node
    // -> B) Child IS a text node that contains characters others than
    //           white space
    // so unless child is a text node that contains only white space...
    if (child.nodeType !== 3 || /\S+/.test(child.nodeValue)) {
      Data(child).isSplit = true
      split(child, settings)
    }
  })
  return Data(element, 'isSplit', true)
}
