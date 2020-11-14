import forEach from './utils/forEach'
import toWords from './utils/toWords'
import toChars from './utils/toChars'
import createElement from './utils/createElement'
import parseTypes from './utils/parseTypes'
import getTextContent from './utils/getTextContent'
import extend from './utils/extend'
import defaults from './defaults'
import { Data } from './Data'

const createFragment = () => document.createDocumentFragment()
const createTextNode = (str) => document.createTextNode(str)

/**
 * Splits the text content of a single element using the provided settings.
 * There are three possible split types: lines, words, and characters. Each one
 * is optional, so text can be split into any combination of the three types.
 *
 * @param {HTMLElement} element the target element
 * @param {Object} settings
 * @return {{
 *   lines: HTMLElement[],
 *   words: HTMLElement[],
 *   chars: HTMLElement[]
 * }}
 */
export default function splitSingleElement(element, settings) {
  settings = extend(defaults, settings)
  // The split types
  const types = parseTypes(settings.types)
  // the tag name for split text nodes
  const TAG_NAME = settings.tagName
  // A unique string to temporarily replace <br> tags
  const BR_SYMBOL = `B${new Date() * 1}R`
  // (boolean) true if position is set to absolute
  const isAbsolute = settings.position === 'absolute' || settings.absolute
  // The array of wrapped line elements
  let lines = []
  // The array of wrapped words elements
  let words = []
  // The array of wrapped character elements
  let chars = []
  // The plain text content of the target element
  let splitText

  /**------------------------------------------------
   ** SPLIT TEXT INTO WORDS AND CHARACTERS
   **-----------------------------------------------*/

  // `splitText` is a wrapper to hold the HTML structure
  splitText = types.lines ? createElement('div') : createFragment()

  // Get the element's text content.
  const TEXT_CONTENT = getTextContent(element, BR_SYMBOL)

  // Create an array of wrapped word elements.
  words = toWords(TEXT_CONTENT).reduce((result, WORD, idx, arr) => {
    // Let `wordElement` be the wrapped element for the current word
    let wordElement
    let characterElementsForCurrentWord

    // If the current word is a symbol representing a `<br>` tag,
    // append a `<br>` tag to splitText and continue to the next word
    if (WORD === BR_SYMBOL) {
      splitText.appendChild(createElement('br'))
      return result
    }

    // If splitting text into characters...
    if (types.chars) {
      // Iterate through the characters in the current word
      // TODO: support emojis in text
      characterElementsForCurrentWord = toChars(WORD).map((CHAR) => {
        return createElement(TAG_NAME, {
          class: `${settings.splitClass} ${settings.charClass}`,
          style: 'display: inline-block;',
          textContent: CHAR,
        })
      })

      // push the character nodes for this word onto the array of
      // all character nodes
      chars = chars.concat(characterElementsForCurrentWord)
    } // END IF;

    if (types.words || types.lines) {
      // | If Splitting Text Into Words...
      // | Create an element (`wordElement`) to wrap the current word.
      // | If we are also splitting text into characters, the word element
      // | will contain the wrapped character nodes for this word. If not,
      // | it will contain the `WORD`
      wordElement = createElement(TAG_NAME, {
        class: `${settings.wordClass} ${settings.splitClass}`,
        style: `display: inline-block; position: ${
          types.words ? 'relative' : 'static'
        }`,
        children: types.chars ? characterElementsForCurrentWord : null,
        textContent: !types.chars ? WORD : null,
      })
      splitText.appendChild(wordElement)
    } else {
      // | If NOT splitting into words OR lines...
      // | Append the characters elements directly to splitText.
      forEach(characterElementsForCurrentWord, (characterElement) => {
        splitText.appendChild(characterElement)
      })
    }

    if (idx !== arr.length - 1) {
      // Add a space after the word.
      splitText.appendChild(createTextNode(' '))
    }

    // If we not splitting text into words, we return an empty array
    return types.words ? result.concat(wordElement) : result
  }, [])

  // 4. Replace the original HTML content of the element with the `splitText`
  element.innerHTML = ''
  element.appendChild(splitText)

  // Unless we are splitting text into lines or using
  if (!isAbsolute && !types.lines) {
    return { chars, words, lines: [] }
  }

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

  // TODO: Is it necessary to store `nodes` in the cache?
  // nodes is a live HTML collection of the nodes in this element
  const nodes = Data(element, 'nodes', element.getElementsByTagName(TAG_NAME))

  // Cache the element's parent and next sibling (for DOM removal).
  const parent = element.parentElement
  const nextSibling = element.nextElementSibling

  // get the computed style object for the element
  const cs = window.getComputedStyle(element)
  const align = cs.textAlign

  // If using absolute position...
  if (isAbsolute) {
    // Let contentBox be an object containing the width and offset position of
    // the element's content box (the area inside padding box). This is needed
    // (for absolute positioning) to set the width and position of line
    // elements, which have not been created yet.
    contentBox = {
      left: splitText.offsetLeft,
      top: splitText.offsetTop,
      width: splitText.offsetWidth,
    }

    // Let elementWidth and elementHeight equal the actual width/height of the
    // element. Also check if the element has inline height or width styles
    // already set. If it does, cache those values for later.
    elementWidth = element.offsetWidth
    elementHeight = element.offsetHeight

    Data(element).cssWidth = element.style.width
    Data(element).cssHeight = element.style.height
  }

  // Iterate over every split text node
  forEach(nodes, (node) => {
    if (node === splitText) return
    const isWord = node.parentElement === splitText
    let wordOffsetY

    // a. Detect line breaks by checking the top offset of word nodes.
    //    For each line, create an array (line) containing the words in that
    //    line.
    if (types.lines && isWord) {
      // wordOffsetY is the top offset of the current word.
      wordOffsetY = Data(node, 'top', node.offsetTop)

      // If wordOffsetY is different than the value of lineOffsetY...
      // Then this word is the beginning of a new line.
      // Set lineOffsetY to value of wordOffsetY.
      // Create a new array (line) to hold the words in this line.
      if (wordOffsetY !== lineOffsetY) {
        lineOffsetY = wordOffsetY
        wordsInEachLine.push((wordsInCurrentLine = []))
      }

      // Add the current word node to the line array
      wordsInCurrentLine.push(node)
    }

    // b. Get the size and position of all split text nodes.
    if (isAbsolute) {
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
    // Let splitText be a new document createFragment to hold the HTML
    // structure.
    splitText = createFragment()

    // Iterate over lines of text (see 11 b)
    // Let `line` be the array of words in the current line.
    // Return an array of the wrapped line elements (lineElements)
    lines = wordsInEachLine.map((wordsInThisLine) => {
      // Create an element to wrap the current line.
      const lineElement = createElement(TAG_NAME, {
        class: `${settings.splitClass} ${settings.lineClass}`,
        style: `display: block; text-align: ${align}; width: 100%;`,
      })
      // Append the `lineElement` to `SplitText`
      splitText.appendChild(lineElement)

      // Store size/position values for the line element.
      if (isAbsolute) {
        Data(lineElement).type = 'line'
        // the offset top of the first word in the line
        Data(lineElement).top = Data(wordsInThisLine[0]).top
        Data(lineElement).height = lineHeight
      }

      // Iterate over the word elements in the current line.
      forEach(wordsInThisLine, (wordElement, idx, arr) => {
        if (types.words) {
          // | If we are splitting text into words,
          // | just append each wordElement to the lineElement.
          lineElement.appendChild(wordElement)
        } else if (types.chars) {
          // | If splitting text into characters but not words...
          // | Append the character elements directly to the line element
          forEach(wordElement.children, (charNode) => {
            lineElement.appendChild(charNode)
          })
        } else {
          // | If NOT splitting into words OR characters...
          // | append the plain text content of the word to the line element
          lineElement.appendChild(createTextNode(wordElement.textContent))
        }
        // Add a space after the word
        if (idx !== arr.length - 1) {
          lineElement.appendChild(createTextNode(' '))
        }
      }) // END LOOP

      return lineElement
    }) // END LOOP

    // 10. Insert the new splitText
    element.replaceChild(splitText, element.firstChild)
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

  if (isAbsolute) {
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

  return { lines, words: types.words ? words : [], chars }
}
