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
 * Splits the text content of a single TextNode into words and/or characters.
 *
 * This functions gets called for every text node inside the target element. It
 * replaces the text node with a document fragment containing the split text.
 * Returns an array of the split word and character elements from this node.
 *
 * @param {TextNode} textNode
 * @param {Object} settings
 * @return {{words: Element[], chars: Element[]}}
 */
export default function splitWordsAndChars(textNode, settings) {
  settings = extend(defaults, settings)
  // The split types
  const types = parseTypes(settings.types)
  // the tag name for split text nodes
  const TAG_NAME = settings.tagName
  // text content of the element (trims white space)
  const TEXT_CONTENT = getTextContent(textNode)
  // `splitText` is a wrapper to hold the HTML structure
  const splitText = document.createDocumentFragment()

  // Arrays of split word and character elements
  let words = []
  let chars = []

  if (/^\s/.test(textNode.nodeValue)) {
    splitText.append(' ')
  }

  // Create an array of wrapped word elements.
  words = toWords(TEXT_CONTENT).reduce((result, WORD, idx, arr) => {
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
        chars = [...chars, characterElement]
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
      Data(wordElement).isWordStart = true
      Data(wordElement).isWordEnd = true
      splitText.appendChild(wordElement)
    } else {
      // -> If NOT splitting into words OR lines...
      //    Append the characters elements directly to splitText.
      characterElementsForCurrentWord.forEach((characterElement) => {
        splitText.appendChild(characterElement)
      })
    }

    if (idx < arr.length - 1) {
      // Add a space after the word.
      splitText.appendChild(createTextNode(' '))
    }

    // If not splitting text into words, we return an empty array
    return types.words ? result.concat(wordElement) : result
  }, []) // END LOOP;

  // Add a trailing white space to maintain word spacing
  if (/\s$/.test(textNode.nodeValue)) {
    splitText.append(' ')
  }
  textNode.replaceWith(splitText)
  return { words, chars }
}
