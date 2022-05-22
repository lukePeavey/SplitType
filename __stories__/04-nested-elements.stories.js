import getTemplate from './helpers/getTemplate'
import count from './helpers/count'
import { baseArgTypes } from './constants'

const text = `<a href="#" target="_blank">SplitType</a> now fully supports <strong>nested elements</strong>`

export default {
  title: 'Nested Elements',
  argTypes: { ...baseArgTypes },
}

// Expected results
// number of words that are direct child of target element
// Number of lines (when width of target element is >= 700px )
const lineCount = 1
// Total number of words and characters
const { words, chars, plainWords } = count(text)
// Create the story template
const Template = getTemplate({ children: text })

export const NotSplit = Template.bind({})
NotSplit.args = { types: 'none' }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = { types: 'lines, words, chars' }
SplitLinesWordsAndChars.parameters = {
  async puppeteerTest(page) {
    // Total number of line, word, and character elements is correct
    expect((await page.$$('.target .line')).length).toEqual(lineCount)
    expect((await page.$$('.target .word')).length).toEqual(words)
    expect((await page.$$('.target .char')).length).toEqual(chars)
    // Number of words directly inside a line element
    expect((await page.$$('.target > .line > .word')).length).toEqual(
      plainWords
    )
    // Nested link element
    // - is immediate child of a line element
    // - contains a single word element, which contains 9 character elements
    expect((await page.$$('.target > .line > a')).length).toEqual(1)
    expect((await page.$$('a > .word')).length).toEqual(1)
    expect((await page.$$('a > .word > .char')).length).toEqual(9)

    // nested `<strong>` element...
    // - is an immediate child a line element
    // - contains two word elements, which contain a total of 14 characters
    expect((await page.$$('.target > .line > strong')).length).toEqual(1)
    expect((await page.$$('strong > .word')).length).toEqual(2)
    expect((await page.$$('strong > .word > .char')).length).toEqual(14)
  },
}

export const SplitLinesAndWords = Template.bind({})
SplitLinesAndWords.args = { types: 'lines, words' }
SplitLinesAndWords.parameters = {
  async puppeteerTest(page) {
    // Total number of line, word, and character elements is correct
    expect((await page.$$('.target .line')).length).toEqual(lineCount)
    expect((await page.$$('.target .word')).length).toEqual(words)
    expect((await page.$$('.target .char')).length).toEqual(0)

    // Number of words directly inside a line element
    expect((await page.$$('.target > .line > .word')).length).toEqual(
      plainWords
    )

    // Nested link element(s)
    // Are immediate children of line element
    // Contain a total of two word elements, which contain a total of 13
    // character elements
    expect((await page.$$('.target > .line > a')).length).toEqual(1)
    expect((await page.$$('.line > a > .word')).length).toEqual(1)

    // nested `<strong>` element...
    // - is an immediate child the line element
    // - contains two word elements, which contain a total of 14 characters
    expect((await page.$$('.target > .line > strong')).length).toEqual(1)
    expect((await page.$$('.line > strong > .word')).length).toEqual(2)
  },
}

export const SplitWordsAndChars = Template.bind({})
SplitWordsAndChars.args = { types: 'words, chars' }
SplitWordsAndChars.parameters = {
  async puppeteerTest(page) {
    // Total number of line, word, and character elements is correct
    expect((await page.$$('.target .line')).length).toEqual(0)
    expect((await page.$$('.target .word')).length).toEqual(words)
    expect((await page.$$('.target .char')).length).toEqual(chars)

    // Nested link element(s)
    // Are immediate children of line element
    // Contain a total of two word elements, which contain a total of 13
    // character elements
    expect((await page.$$('.target > a')).length).toEqual(1)
    expect((await page.$$('.target a > .word')).length).toEqual(1)
    expect((await page.$$('.target a > .word > .char')).length).toEqual(9)

    // nested `<strong>` element...
    // - is an immediate child the target element
    // - contains two word elements, which contains a total of 14 characters
    expect((await page.$$('.target > strong')).length).toEqual(1)
    expect((await page.$$('strong > .word')).length).toEqual(2)
    expect((await page.$$('strong > .word > .char')).length).toEqual(14)
  },
}

export const SplitWords = Template.bind({})
SplitWords.args = { types: 'words' }
SplitWords.parameters = {
  async puppeteerTest(page) {
    // Total number of line, word, and character elements is correct
    expect((await page.$$('.target .line')).length).toEqual(0)
    expect((await page.$$('.target .word')).length).toEqual(words)
    expect((await page.$$('.target .char')).length).toEqual(0)

    // Nested link element(s)
    // Are immediate children of target element
    // Contain a total of two word elements
    expect((await page.$$('.target > a')).length).toEqual(1)
    expect((await page.$$('.target > a > .word')).length).toEqual(1)

    // nested `<strong>` element...
    // - is an immediate child the target element
    // - contains two word elements
    expect((await page.$$('.target > strong')).length).toEqual(1)
    expect((await page.$$('.target > strong > .word')).length).toEqual(2)
  },
}
