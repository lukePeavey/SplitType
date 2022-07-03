import toArray from './utils/toArray'
import parseTypes from './utils/parseTypes'
import getPosition from './utils/getPosition'
import createElement from './utils/createElement'
import unSplitWords from './unSplitWords'
import * as data from './Data'

const createFragment = () => document.createDocumentFragment()

export default function repositionAfterSplit(element, settings, scrollPos) {
  const types = parseTypes(settings.types)
  const TAG_NAME = settings.tagName
  const nodes = element.getElementsByTagName('*')
  const wordsInEachLine = []
  let wordsInCurrentLine = []
  let lineOffsetY = null
  let elementHeight
  let elementWidth
  let contentBox
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

  // Cache the element's parent and next sibling (for DOM removal).
  const parent = element.parentElement
  const nextSibling = element.nextElementSibling

  // a wrapper for the new HTML structure
  const splitText = createFragment()

  // get the computed style object for the element
  const cs = window.getComputedStyle(element)
  const align = cs.textAlign
  const fontSize = parseFloat(cs.fontSize)
  const lineThreshold = fontSize * 0.2

  // IF using absolute position...
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

    // Store the original inline height and width of the element
    data.set(element, {
      cssWidth: element.style.width,
      cssHeight: element.style.height,
    })
  }

  // Iterate over every node in the target element
  toArray(nodes).forEach((node) => {
    // node is a word element or custom html element
    const isWordLike = node.parentElement === element
    // TODO needs work
    // Get te size and position of split text nodes
    const { width, height, top, left } = getPosition(
      node,
      isWordLike,
      settings,
      scrollPos
    )
    // If element is a `<br>` tag return here
    if (/^br$/i.test(node.nodeName)) return

    if (types.lines && isWordLike) {
      // We compare the top offset of the current word to the top offset of
      // previous words on the current line. If the difference is greater than
      // our defined threshold (20%), we assume this word is on a new line.
      if (lineOffsetY === null || top - lineOffsetY >= lineThreshold) {
        lineOffsetY = top
        wordsInEachLine.push((wordsInCurrentLine = []))
      }

      // Add the current word node to the line array
      wordsInCurrentLine.push(node)
    } // END IF

    if (settings.absolute) {
      // Store the size and position split text nodes
      data.set(node, { top, left, width, height })
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
      data.set(lineElement, 'isLine', true)

      const lineDimensions = { height: 0, top: 1e4 }

      // Append the `lineElement` to `container`
      splitText.appendChild(lineElement)

      // Iterate over the word-level elements in the current line.
      // Note: wordOrElement can either be a word node or nested element
      wordsInThisLine.forEach((wordOrElement, idx, arr) => {
        const { isWordEnd, top, height } = data.get(wordOrElement)
        const next = arr[idx + 1]

        // Determine line height / y-position
        // we use the height and offsetTop of the words which we already
        // recorded. Because custom nested elements could have their own
        // styles, the words on a line may not all be the same height or
        // y position. So we take the greatest height / y - offset of the
        // words on this line.
        lineDimensions.height = Math.max(lineDimensions.height, height)
        lineDimensions.top = Math.min(lineDimensions.top, top)
        // append the current word/element
        lineElement.appendChild(wordOrElement)
        // Determine if there should space after the current element...
        // If this is not the last word on the current line.
        // TODO - logic for handing spacing can be improved
        if (isWordEnd && data.get(next).isWordStart) {
          lineElement.append(' ')
        }
      }) // END LOOP

      if (settings.absolute) {
        data.set(lineElement, {
          height: lineDimensions.height,
          top: lineDimensions.top,
        })
      }

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

  // Apply absolute positioning to all child elements of the target element.
  // This includes split lines, words, chars, and custom HTML elements that were
  // included by the user. The size and position of child elements has already
  // been recorded before splitting text into lines.

  if (settings.absolute) {
    // Set the width/height of the parent element so it does not collapse
    // when its children are set to absolute position.
    element.style.width = `${element.style.width || elementWidth}px`
    element.style.height = `${elementHeight}px`

    // Iterate over all child elements
    toArray(nodes).forEach((node) => {
      const { isLine, top, left, width, height } = data.get(node)
      const parentData = data.get(node.parentElement)
      const isChildOfLineNode = !isLine && parentData.isLine

      // Set the top position of the current node.
      // -> If `node` a line element, we use the top offset of its first child
      // -> If `node` the child of line element, then its top offset is zero
      node.style.top = `${isChildOfLineNode ? top - parentData.top : top}px`

      // Set the left position of the current node.
      // -> IF `node` is a line element, this is equal to the position left of
      //    the content box of the parent element
      // -> IF `node` is the child of a line element, the value has to adjusted
      //    so its relative to the line element
      node.style.left = isLine
        ? `${contentBox.left}px`
        : `${left - (isChildOfLineNode ? contentBox.left : 0)}px`

      // Set the height of the current node to the cached value.
      node.style.height = `${height}px`

      //  Set the width of the current node.
      //  If its a line element, width is equal to the width of the contentBox.
      node.style.width = isLine ? `${contentBox.width}px` : `${width}px`

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
