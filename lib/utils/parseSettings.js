import extend from './extend'
import isString from './isString'
import isArray from './isArray'

/**
 * Parses user supplied settings objects.
 */
export default function parseSettings(settings = {}) {
  const object = extend(settings)
  // `split` may be used as an alias for the `types` option
  // Parse the `types` settings into an array of valid split types.
  // If `types` is explicitly set to an empty string or array, text will not be
  // split at all.
  let types
  if (object.types !== undefined) {
    types = object.types
  } else if (object.split !== undefined) {
    types = object.split
  }

  if (types !== undefined) {
    object.types = (isString(types) || isArray(types) ? String(types) : '')
      .split(',')
      .map((type) => String(type).trim())
      .filter((type) => /((line)|(word)|(char))/i.test(type))
  }

  // Support `position: absolute` as an alias for `absolute: true`
  if (object.absolute || object.position) {
    object.absolute = object.absolute || /absolute/.test(settings.position)
  }
  return object
}
