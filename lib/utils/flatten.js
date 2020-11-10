import toArray from './toArray'

/**
 * Flattens nested ArrayLike object (max 2 levels deep)
 */
export default function flatten(obj) {
  return toArray(obj).reduce((result, item) => {
    return result.concat(toArray(item))
  }, [])
}
