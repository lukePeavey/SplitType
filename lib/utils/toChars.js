/**
 * Splits a string into an array of characters
 *
 * TODO:
 * Add support strings that contain unicode characters (ie Emojis and symbols)
 *
 * @param {string} string the string to split
 * @param {string|RegExp} [separator = ''] Pattern used to separate characters
 * @return {string[]} the array of chars
 * @example
 * toChars('foo')
 * // => ['f', 'o', 'o']
 *
 * toChars('foo bar')
 * // => ["f", "o", "o", " ", "b", "a", "r"]
 *
 * toChars('f-o-o', /-/)
 * // => ['f', 'o', 'o']
 *
 * toChars()
 * // => []
 */
export default function toChars(string, separator = '') {
  string = string == null ? '' : String(string)
  return string.split(separator)
}
