import split from '../lib/split'
import defaults from '../lib/defaults'
import createElement from '../lib/utils/createElement'

// The `split` function splits the text in a single element, replacing the text
// content with individual elements representing lines, words, and characters.
// Its not possible to fully test this function in a virtual DOM environment.
// The following functionality can only be tested in an actual browser:
// - Splitting text into lines based on natural line breaks
// - Positioning split text nodes using absolute position
// - Splitting text into elements without impacting the visual appearance of
//   the text.

// TODO: Refactor to reduce repetition or find a better way to test this
// function.

describe('split(element, options)', () => {
  const textContent = 'foo bar'
  const plainTextChars = textContent.replace(/\s/g, '').split('')
  const plainTextWords = textContent.split(' ')
  it(`Splits text into words`, () => {
    const settings = { ...defaults, types: 'words' }
    const elem = createElement('div', { textContent })
    const result = split(elem, settings)
    // 1. `result.chars` should be an empty array
    expect(result.chars).toEqual([])
    // 2. `result.words` should be an array of the spit word elements
    expect(result.words.length).toBe(plainTextWords.length)
    result.words.forEach((word, i) => {
      // Each item in `result.words` should an HTML element with the
      // correct text content and className
      expect(word.tagName).toMatch(new RegExp(settings.tagName, 'i'))
      expect(word.textContent).toEqual(plainTextWords[i])
      expect(word.classList.contains(settings.wordClass)).toBe(true)
    })
    // 3. `result.lines` should be an empty array
    expect(result.lines).toEqual([])
    // 4. The target element should contain the three wrapped word elements
    expect(Array.from(elem.children)).toEqual(result.words)
  })

  it(`Splits text into characters`, () => {
    const settings = { ...defaults, types: 'chars' }
    const elem = createElement('div', { textContent })
    const result = split(elem, settings)
    // 1. `result.chars` should be an array of the split character elements
    expect(result.chars.length).toBe(plainTextChars.length)
    result.chars.forEach((char, i) => {
      // Each item in `result.chars` should an HTML element with the
      // correct text content and className
      expect(char.tagName).toMatch(new RegExp(settings.tagName, 'i'))
      expect(char.textContent).toEqual(plainTextChars[i])
      expect(char.classList.contains(settings.charClass)).toBe(true)
    })
    // 3. `words` should be an empty array
    expect(result.words).toEqual([])
    // 2. `lines` should be an empty array
    expect(result.lines).toEqual([])
    // 4. The target element should contain 11 wrapped character elements
    expect(Array.from(elem.children)).toEqual(result.chars)
  })

  it(`Splits text into words and characters`, () => {
    const settings = { ...defaults, types: 'chars, words' }
    const elem = createElement('div', { textContent })
    const result = split(elem, settings)
    // 1. `result.chars` should be an array of split character elements
    expect(result.chars.length).toBe(plainTextChars.length)
    result.chars.forEach((char, i) => {
      // Each item in `result.chars` should an HTML element with the
      // correct text content and className
      expect(char.tagName).toMatch(new RegExp(settings.tagName, 'i'))
      expect(char.textContent).toEqual(plainTextChars[i])
      expect(char.classList.contains(settings.charClass)).toBe(true)
    })
    // 2. `result.words` should be an array of the split word elements
    expect(result.words.length).toBe(plainTextWords.length)
    result.words.forEach((word, i) => {
      // Each item in `result.words` should an HTML element with the
      // correct text content and className
      expect(word.tagName).toMatch(new RegExp(settings.tagName, 'i'))
      expect(word.textContent).toEqual(plainTextWords[i])
      expect(word.classList.contains(settings.wordClass)).toBe(true)
    })
    // 3. `result.lines` should be an empty array
    expect(result.lines).toEqual([])
    // 4. The target element should contain 11 wrapped character elements
    expect(Array.from(elem.children)).toEqual(result.words)
  })

  it(`Splits text into lines`, () => {
    const settings = { ...defaults, types: 'lines' }
    const elem = createElement('div', { textContent })
    const result = split(elem, settings)
    // 1. `result.chars` an empty array
    expect(result.chars).toEqual([])
    // 2. `result.words` an empty array
    expect(result.words).toEqual([])
    // 3. `result.lines` should be an array of split line elements
    // When running tests in a virtual dom, there will always be one line.
    expect(result.lines.length).toBe(1)
    expect(result.lines[0].tagName).toMatch(new RegExp(settings.tagName, 'i'))
    expect(result.lines[0].classList.contains(settings.lineClass)).toBe(true)
    expect(result.lines[0].textContent).toEqual(textContent)
  })

  it(`Splits text into lines and words`, () => {
    const settings = { ...defaults, types: 'lines, words' }
    const elem = createElement('div', { textContent })
    const result = split(elem, settings)
    // 1. `result.chars` should be an empty array
    expect(result.chars).toEqual([])
    // 2. `result.words` should be an array containing 3 wrapped word elements
    expect(result.words.length).toBe(plainTextWords.length)
    result.words.forEach((word, i) => {
      // Each item in `result.words` should an HTML element with the
      // correct text content and className
      expect(word.tagName).toMatch(new RegExp(settings.tagName, 'i'))
      expect(word.textContent).toEqual(plainTextWords[i])
      expect(word.classList.contains(settings.wordClass)).toBe(true)
    })
    // 3. `result.lines` should be an array of split line elements
    expect(result.lines.length).toBe(1)
    expect(result.lines[0].tagName).toMatch(new RegExp(settings.tagName, 'i'))
    expect(result.lines[0].classList.contains(settings.lineClass)).toBe(true)
    expect(result.lines[0].textContent).toEqual(textContent)
  })

  it(`Splits text into lines and characters`, () => {
    const settings = { ...defaults, types: 'lines, chars' }
    const elem = createElement('div', { textContent })
    const result = split(elem, settings)
    // 1. `result.chars` should be an array of split character elements
    expect(result.chars.length).toBe(plainTextChars.length)
    result.chars.forEach((char, i) => {
      // Each item in `result.chars` should an HTML element with the
      // correct text content and className
      expect(char.tagName).toMatch(new RegExp(settings.tagName, 'i'))
      expect(char.textContent).toEqual(plainTextChars[i])
      expect(char.classList.contains(settings.charClass)).toBe(true)
    })
    // 2. `result.words` should an empty array
    expect(result.words).toEqual([])
    // 3. `result.lines` should be an array of split line elements
    expect(result.lines.length).toBe(1)
    expect(result.lines[0].tagName).toMatch(new RegExp(settings.tagName, 'i'))
    expect(result.lines[0].classList.contains(settings.lineClass)).toBe(true)
    expect(result.lines[0].textContent).toEqual(textContent)
  })

  it(`Splits text into lines, words and characters`, () => {
    const settings = defaults
    const elem = createElement('div', { textContent })
    const result = split(elem, settings)
    // 1. `result.chars` should be an array of split character elements
    expect(result.chars.length).toBe(plainTextChars.length)
    result.chars.forEach((char, i) => {
      // Each item in `result.chars` should an HTML element with the
      // correct text content and className
      expect(char.tagName).toMatch(new RegExp(settings.tagName, 'i'))
      expect(char.textContent).toEqual(plainTextChars[i])
      expect(char.classList.contains(settings.charClass)).toBe(true)
    })
    // 2. `result.words` should be an array containing 3 wrapped word elements
    expect(result.words.length).toBe(plainTextWords.length)
    result.words.forEach((word, i) => {
      // Each item in `result.words` should an HTML element with the
      // correct text content and className
      expect(word.tagName).toMatch(new RegExp(settings.tagName, 'i'))
      expect(word.textContent).toEqual(plainTextWords[i])
      expect(word.classList.contains(settings.wordClass)).toBe(true)
    })
    // 3. `result.lines` should be an array of split line elements
    expect(result.lines.length).toBe(1)
    expect(result.lines[0].tagName).toMatch(new RegExp(settings.tagName, 'i'))
    expect(result.lines[0].classList.contains(settings.lineClass)).toBe(true)
    expect(result.lines[0].textContent).toEqual(textContent)
  })

  it(`Splits text containing unicode characters`, () => {
    const elem = createElement('div', { textContent: '📌foo' })
    const result = split(elem)
    expect(result.chars[0].textContent).toEqual('📌')
  })
})
