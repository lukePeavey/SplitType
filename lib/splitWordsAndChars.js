import forEach from './utils/forEach'
import toWords from './utils/toWords'
import toChars from './utils/toChars'
import createElement from './utils/createElement'
import createTextNode from './utils/createTextNode'
import parseTypes from './utils/parseTypes'
import extend from './utils/extend'
import getTextContent from './utils/getTextContent'
import defaults from './defaults'
import { Data } from './Data'

/**
 * Splits the text content of a single node into words and/or characters.
 *
 * @param {TextNode} element
 * @param {Object} settings
 */
export default function splitWordsAndChars(element, settings) {
  settings = extend(defaults, settings)
  // The split types
  const types = parseTypes(settings.types)
  // the tag name for split text nodes
  const TAG_NAME = settings.tagName
  // text content of the element (trims white space)
  const TEXT_CONTENT = getTextContent(element)
  // `splitText` is a wrapper to hold the HTML structure
  const splitText = document.createDocumentFragment()

  // Add a leading white space to maintain word spacing
  if (/^\s/.test(element.nodeValue)) {
    splitText.append(createTextNode(' '))
  }

  // Create an array of wrapped word elements.
  toWords(TEXT_CONTENT).reduce((result, WORD, idx, arr) => {
    // Let `wordElement` be the wrapped element for the current word
    let wordElement
    let characterElementsForCurrentWord

    // -> If splitting text into characters...
    if (types.chars) {
      // Iterate through the characters in the current word
      characterElementsForCurrentWord = toChars(WORD).map((CHAR) => {
        const characterElement = createElement(TAG_NAME, {
          class: `${settings.splitClass} ${settings.charClass}`,
          style: 'display: inline-block;',
          children: CHAR,
        })
        Data(characterElement).isChar = true
        return characterElement
      })
    } // END IF;

    if (types.words || types.lines) {
      // -> If Splitting Text Into Words...
      //    Create an element to wrap the current word. If we are also
      //    splitting text into characters, the word element will contain the
      //    wrapped character nodes for this word. If not, it will contain the
      //    plain text content (WORD)
      wordElement = createElement(TAG_NAME, {
        class: `${settings.wordClass} ${settings.splitClass}`,
        style: `display: inline-block; position: ${
          types.words ? 'relative' : 'static'
        }`,
        children: types.chars ? characterElementsForCurrentWord : WORD,
      })
      Data(wordElement).isWord = true
      splitText.appendChild(wordElement)
    } else {
      // -> If NOT splitting into words OR lines...
      //    Append the characters elements directly to splitText.
      forEach(characterElementsForCurrentWord, (characterElement) => {
        splitText.appendChild(characterElement)
      })
    }

    if (idx !== arr.length - 1) {
      // Add a space after the word.
      splitText.appendChild(createTextNode(' '))
    }

    // If not splitting text into words, we return an empty array
    return types.words ? result.concat(wordElement) : result
  }, [])

  // Add a trailing white space to maintain word spacing
  if (/\s$/.test(element.nodeValue)) {
    splitText.append(createTextNode(' '))
  }
  element.replaceWith(splitText)
}
