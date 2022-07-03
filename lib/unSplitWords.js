import toArray from './utils/toArray'
import * as data from './Data'

/**
 * Recursively "un-splits" text into words.
 * This is used when splitting text into lines but not words.
 * We initially split the text into words so we can maintain the correct line
 * breaks. Once text has been split into lines, we "un-split" the words...
 * @param {Element}
 * @return {void}
 */
export default function unSplitWords(element) {
  if (!data.get(element).isWord) {
    toArray(element.children).forEach((child) => unSplitWords(child))
  } else {
    data.remove(element)
    element.replaceWith(...element.childNodes)
  }
}
