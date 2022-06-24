/**
 * Splits a string into an array of words.
 *
 * @param {string} string
 * @param {string | RegExp} [separator = ' ']
 * @return {string[]} Array of words
 */
export default function toWords(value, separator = ' ') {
  const string = value ? String(value) : ''
  return string.trim().replace(/\s+/g, ' ').split(separator)
}
