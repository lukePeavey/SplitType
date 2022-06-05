import getTemplate from './helpers/getTemplate'
import count from './helpers/count'
import { baseArgTypes } from './constants'

const children = `<a href="#" target="_blank">SplitType</a> now supports <strong>nested elements</strong> like <code>&lt;span&gt;</code>, <code>&lt;strong&gt;</code>, and <code>&lt;em&gt;</code>. You can also use interactive elements like a <button>button</button> or <a href="#" target="_blank">link</a> inside your split text.`

export default {
  title: 'Tests/Multi-line Nested Elements',
  argTypes: { ...baseArgTypes },
}

const lines = 4
const { words: actualWords, chars, plainWords } = count(children)
const words = actualWords + 3

// Create the story template
const Template = getTemplate({ children, className: 'fixed' })

export const NotSplit = Template.bind({})
NotSplit.args = { types: 'none' }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = { types: 'lines, words, chars' }
SplitLinesWordsAndChars.parameters = {
  async puppeteerTest(page) {
    // Total number of line, word, and character elements is correct
    expect((await page.$$('.target .line')).length).toEqual(lines)
    expect((await page.$$('.target .word')).length).toEqual(words)
    expect((await page.$$('.target .char')).length).toEqual(chars)
    // Number of words directly inside a line element
    expect((await page.$$('.target > .line > .word')).length).toEqual(
      plainWords
    )
    // Nested button element...
    // - is an immediate child of a line element
    // - contains a single word element, which contains 6 character elements
    expect((await page.$$('.target > .line > button')).length).toEqual(1)
    expect((await page.$$('button > .word')).length).toEqual(1)
    expect((await page.$$('button > .word > .char')).length).toEqual(6)

    // Nested link element(s)
    // Are immediate children of line element
    // Contain a total of two word elements, which contain a total of 13
    // character elements
    expect((await page.$$('.target > .line > a')).length).toEqual(2)
    expect((await page.$$('a > .word')).length).toEqual(2)
    expect((await page.$$('a > .word > .char')).length).toEqual(13)

    // nested `<strong>` element...
    // - is an immediate child the line element
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
    expect((await page.$$('.target .line')).length).toEqual(lines)
    expect((await page.$$('.target .word')).length).toEqual(words)
    expect((await page.$$('.target .char')).length).toEqual(0)

    // Number of words directly inside a line element
    expect((await page.$$('.target > .line > .word')).length).toEqual(
      plainWords
    )
    // Nested button element...
    // - is an immediate child of a line element
    // - contains a single word element, which contains 6 character elements
    expect((await page.$$('.target > .line > button')).length).toEqual(1)
    expect((await page.$$('.line > button > .word')).length).toEqual(1)

    // Nested link element(s)
    // Are immediate children of line element
    // Contain a total of two word elements, which contain a total of 13
    // character elements
    expect((await page.$$('.target > .line > a')).length).toEqual(2)
    expect((await page.$$('.line > a > .word')).length).toEqual(2)

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

    // Nested button element...
    // - is an immediate child of target element
    // - contains a single word element, which contains 6 character elements
    expect((await page.$$('.target > button')).length).toEqual(1)
    expect((await page.$$('button > .word')).length).toEqual(1)
    expect((await page.$$('button > .word > .char')).length).toEqual(6)

    // Nested link element(s)
    // Are immediate children of line element
    // Contain a total of two word elements, which contain a total of 13
    // character elements
    expect((await page.$$('.target > a')).length).toEqual(2)
    expect((await page.$$('.target a > .word')).length).toEqual(2)
    expect((await page.$$('.target a > .word > .char')).length).toEqual(13)

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

    // Nested button element...
    // - is an immediate child of target element
    // - contains 1 word element
    expect((await page.$$('.target > button')).length).toEqual(1)
    expect((await page.$$('.target > button > .word')).length).toEqual(1)

    // Nested link element(s)
    // Are immediate children of target element
    // Contain a total of two word elements
    expect((await page.$$('.target > a')).length).toEqual(2)
    expect((await page.$$('.target > a > .word')).length).toEqual(2)

    // nested `<strong>` element...
    // - is an immediate child the target element
    // - contains two word elements
    expect((await page.$$('.target > strong')).length).toEqual(1)
    expect((await page.$$('.target > strong > .word')).length).toEqual(2)
  },
}
