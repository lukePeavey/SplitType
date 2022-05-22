/* eslint-disable no-restricted-syntax */
import createElement from '../../lib/utils/createElement'
import toWords from '../../lib/utils/toWords'
import toChars from '../../lib/utils/toChars'

/**
 * Counts the number of words and characters in a given html string
 */
export default function count(str) {
  const el = createElement('div')
  el.innerHTML = str
  const words = toWords(el.textContent).length
  const chars = toChars(el.textContent).filter((char) => char.trim()).length
  let plainWords = 0
  for (const child of el.childNodes) {
    if (child.nodeType === 3) {
      plainWords += toWords(child.nodeValue.trim()).length
    }
  }

  return { words, chars, plainWords }
}
