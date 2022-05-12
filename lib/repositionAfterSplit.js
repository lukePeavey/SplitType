import forEach from './utils/forEach'
import parseTypes from './utils/parseTypes'
import createElement from './utils/createElement'
import unSplitWords from './unSplitWords'
import { Data } from './Data'

const createTextNode = (str = '') => document.createTextNode(str)
const createFragment = () => document.createDocumentFragment()

export default function repositionAfterSplit(element, settings) {
  const types = parseTypes(settings.types)
  const TAG_NAME = settings.tagName
  // TODO: Is it necessary to store `nodes` in the cache?
  // nodes is a live HTML collection of the nodes in this element
  const nodes = element.getElementsByTagName('*')

  let lines = []
  /**------------------------------------------------
   ** GET STYLES AND POSITIONS
   **-----------------------------------------------*/

  // There is no built-in way to detect natural line breaks in text (when a
  // block of text wraps to fit its container). To split text into lines, we
  // have to detect line breaks by checking the top offset of words. This is
  // why text was split into words first. To apply absolute
  // positioning, its also necessary to record the size and position of every
  // split node (lines, words, characters).

  // To consolidate DOM getting/settings, this is all done at the same time,
  // before actually splitting text into lines, which involves restructuring
  // the DOM again.

  const wordsInEachLine = []
  let wordsInCurrentLine = []
  let lineHeight
  let elementHeight
  let elementWidth
  let contentBox
  let lineOffsetY

  // Cache the element's parent and next sibling (for DOM removal).
  const parent = element.parentElement
  const nextSibling = element.nextElementSibling

  // a wrapper for the new HTML structure
  const splitText = createFragment()

  // get the computed style object for the element
  const cs = window.getComputedStyle(element)
  const align = cs.textAlign

  // -> If using absolute position...
  if (settings.absolute) {
    // Let contentBox be an object containing the width and offset position of
    // the element's content box (the area inside padding box). This is needed
    // (for absolute positioning) to set the width and position of line
    // elements, which have not been created yet.
    contentBox = {
      left: element.offsetLeft,
      top: element.offsetTop,
      width: element.offsetWidth,
    }

    // Let elementWidth and elementHeight be the actual width/height of the
    // element. Also check if the element has inline height or width styles
    // already set. If it does, cache those values for later.
    elementWidth = element.offsetWidth
    elementHeight = element.offsetHeight

    Data(element).cssWidth = element.style.width
    Data(element).cssHeight = element.style.height
  }

  // Iterate over every node in the target element
  forEach(nodes, (node) => {
    // node is a word element or custom html element
    const isWordLike = node.parentElement === element
    let wordOffsetY

    if (/^br$/i.test(node.nodeName)) {
      // If node is a `<br>` tag return here
      return
    }

    // Detect line breaks by checking the top offset of word nodes. For each
    // line, create an array (line) containing the words in that line.
    if (types.lines && isWordLike) {
      // wordOffsetY is the top offset of the current word.
      wordOffsetY = Data(node, 'top', node.offsetTop)

      // If wordOffsetY is different than the value of lineOffsetY...
      // Then this word is the beginning of a new line.
      // Create a new array (line) to hold the words in this line.
      if (wordOffsetY !== lineOffsetY) {
        lineOffsetY = wordOffsetY
        wordsInEachLine.push((wordsInCurrentLine = []))
      }

      // Add the current word node to the line array
      wordsInCurrentLine.push(node)
    }

    // b. Get the size and position of all split text nodes.
    if (settings.absolute) {
      // The values are stored using the data method
      // All split nodes have the same height (lineHeight). So its only
      // retrieved once.
      // If offset top has already been cached (step 11 a) use the stored value.
      Data(node).top = wordOffsetY || node.offsetTop
      Data(node).left = node.offsetLeft
      Data(node).width = node.offsetWidth
      Data(node).height = lineHeight || (lineHeight = node.offsetHeight)
    }
  }) // END LOOP

  // Remove the element from the DOM
  if (parent) {
    parent.removeChild(element)
  }

  /**------------------------------------------------
   ** SPLIT LINES
   **-----------------------------------------------*/

  if (types.lines) {
    // Iterate over lines of text (see 11 b)
    // Let `line` be the array of words in the current line.
    // Return an array of the wrapped line elements (lineElements)
    lines = wordsInEachLine.map((wordsInThisLine) => {
      // Create an element to wrap the current line.
      const lineElement = createElement(TAG_NAME, {
        class: `${settings.splitClass} ${settings.lineClass}`,
        style: `display: block; text-align: ${align}; width: 100%;`,
      })
      // Append the `lineElement` to `container`
      splitText.appendChild(lineElement)

      // Store size/position values for the line element.
      if (settings.absolute) {
        Data(lineElement).type = 'line'
        // the offset top of the first word in the line
        Data(lineElement).top = Data(wordsInThisLine[0]).top
        Data(lineElement).height = lineHeight
      }

      // Iterate over the word like elements in the current line.
      // Note: we refer to these elements as word-like because they
      // can either be split word elements or custom html elements.
      forEach(wordsInThisLine, (wordLikeElement, idx, arr) => {
        lineElement.appendChild(wordLikeElement)
        // Add a space after the word
        if (idx !== arr.length - 1) {
          lineElement.appendChild(createTextNode(' '))
        }
      }) // END LOOP

      return lineElement
    }) // END LOOP

    if (!types.words) {
      unSplitWords(splitText)
    }
    // 10. Insert the new container
    element.replaceChildren(splitText)
  }

  /**------------------------------------------------
   **  SET ABSOLUTE POSITION
   **-----------------------------------------------*/

  // Apply absolute positioning to all split text elements (lines, words, and
  // characters). The size and relative position of split nodes has already
  // been recorded. Now we use those values to set each element to absolute
  // position. However, positions were logged before text was split into lines
  // (step 13 - 15). So some values need to be recalculated to account for the
  // modified DOM structure.

  if (settings.absolute) {
    // Set the width/height of the parent element, so it does not collapse
    // when its child nodes are set to absolute position.
    element.style.width = `${element.style.width || elementWidth}px`
    element.style.height = `${elementHeight}px`

    // Iterate over all split nodes.
    forEach(nodes, (node) => {
      const isLineNode = Data(node).type === 'line'
      const isChildOfLineNode =
        !isLineNode && Data(node.parentElement).type === 'line'

      // Set the top position of the current node.
      // -> If its a line node, we use the top offset of its first child
      // -> If its the child of line node, then its top offset is zero
      node.style.top = `${isChildOfLineNode ? 0 : Data(node).top}px`

      // Set the left position of the current node.
      // -> If its a line node, this this is equal to the left offset of
      //    contentBox.
      // -> If its the child of a line node, the cached valued must be
      //    recalculated so its relative to the line node (which didn't
      //    exist when value was initially checked). NOTE: the value is
      //    recalculated without querying the DOM again
      node.style.left = isLineNode
        ? `${contentBox.left}px`
        : `${Data(node).left - (isChildOfLineNode ? contentBox.left : 0)}px`

      // Set the height of the current node to the cached value.
      node.style.height = `${Data(node).height}px`

      //  Set the width of the current node.
      //  If its a line element, width is equal to the width of the contentBox.
      node.style.width = isLineNode
        ? `${contentBox.width}px`
        : `${Data(node).width}px`

      // Finally, set the node's position to absolute.
      node.style.position = 'absolute'
    })
  } // end if;

  // 14. Re-attach the element to the DOM
  if (parent) {
    if (nextSibling) parent.insertBefore(element, nextSibling)
    else parent.appendChild(element)
  }

  return lines
}
