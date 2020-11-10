/**
 * Gets the text content of an HTML element.
 *
 * Optionally, <br> tags can be replaced with a unique string so they can be
 * converted back HTML later on.
 *
 * @param {HTMLElement} element
 * @param {string} BR_SYMBOL
 * @return {string} the text content of the given element
 */
export default function getTextContent(element, LINE_BREAK_SYMBOL) {
  const brTag = /<br\s*\/?>/g
  let textContent = element.textContent
  if (LINE_BREAK_SYMBOL) {
    const innerHTML = element.innerHTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = innerHTML.replace(brTag, ` ${LINE_BREAK_SYMBOL} `)
    textContent = tempDiv.textContent
  }
  // Remove extra white space
  return textContent.replace(/\s+/g, ' ').trim()
}
