import isString from './isString'
/**
 * Takes a comma separated list of `types` and returns an objet
 *
 * @param {string | string[]} value a comma separated list of split types
 * @return {{lines: boolean, words: boolean, chars: boolean}}
 */
export default function parseTypes(value) {
  const types = isString(value) || Array.isArray(value) ? String(value) : ''
  return {
    lines: /line/i.test(types),
    words: /word/i.test(types),
    chars: /(char)|(character)/i.test(types),
  }
}
