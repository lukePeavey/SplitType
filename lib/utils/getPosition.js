/**
 * Gets the height and position of an element relative to offset parent.
 * Should be equivalent to offsetTop and offsetHeight, but with sub-pixel
 * precision.
 *
 * TODO needs work
 */
export default function getPosition(node, isWord, settings, scrollPos) {
  if (!settings.absolute) {
    return { top: isWord ? node.offsetTop : null }
  }
  const parent = node.offsetParent
  const [scrollX, scrollY] = scrollPos
  let parentX = 0
  let parentY = 0
  if (parent && parent !== document.body) {
    const parentRect = parent.getBoundingClientRect()
    parentX = parentRect.x + scrollX
    parentY = parentRect.y + scrollY
  }
  const { width, height, x, y } = node.getBoundingClientRect()
  const top = y + scrollY - parentY
  const left = x + scrollX - parentX
  return { width, height, top, left }
}
