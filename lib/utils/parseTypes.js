import isString from './isString'
import isArray from './isArray'
/**
 * Takes a list of `types` and returns an object
 *
 * @param {string | string[]} value a comma separated list of split types
 * @return {{lines: boolean, words: boolean, chars: boolean}}
 */
export default function parseTypes(value) {
  const types = isString(value) || isArray(value) ? String(value) : ''
  return {
    none: !types,
    lines: /line/i.test(types),
    words: /word/i.test(types),
    chars: /char/i.test(types),
  }
}
