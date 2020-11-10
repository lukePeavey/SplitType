/**
 * Splits a string into an array of words.
 *
 * @param {string} string
 * @param {string | RegExp} [separator = ' ']
 * @return {string[]} Array of words
 */
export default function toWords(string, separator = ' ') {
  string = string ? String(string) : ''
  return string.split(separator)
}
