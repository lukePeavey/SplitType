/**
 * Gets the text content of a text node.
 * Trims white space from start/end of string
 * Removes extra white space
 *
 * @param {Node} node a text node
 * @return {string} the text content of the given element
 */
export default function getTextContent(node) {
  const value = node.nodeValue || ''
  return value.replace(/\s+/g, ' ').trim()
}
