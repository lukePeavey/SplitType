import toArray from './utils/toArray'
import { Data } from './Data'

/**
 * Recursively "un-splits" text into words.
 * This is used when splitting text into lines but not words.
 * We initially split the text into words so we can maintain the correct line
 * breaks. Once text has been split into lines, we "un-split" the words...
 */
export default function unSplitWords(element) {
  if (!Data(element).isWord) {
    const children = toArray(element.children)
    children.forEach((child) => unSplitWords(child))
  } else {
    element.replaceWith(...element.childNodes)
  }
}
