import extend from './extend'

/**
 * Parses user supplied settings objects.
 */
export default function parseSettings(settings) {
  const object = extend(settings)
  if (object.types || object.split) {
    // Support `split` as an alias for `types`
    object.types = object.types || object.split
  }
  if (object.absolute || object.position) {
    // Support `position: absolute` as alias for `absolute: true`
    object.absolute = object.absolute || /absolute/.test(settings.position)
  }
  return object
}
