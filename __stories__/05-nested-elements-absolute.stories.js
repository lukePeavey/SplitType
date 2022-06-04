import Example from './components/Example.svelte'
import count from './helpers/count'
import { baseArgTypes } from './constants'

const children = `<a href="#" target="_blank">SplitType</a> now fully supports <strong>nested elements</strong>`

export default {
  title: 'Tests/Nested Elements (Absolute)',
  argTypes: { ...baseArgTypes },
}

// Expected results
// Number of lines (when width of target element is >= 700px )
const lines = 1
const { words, chars, plainWords } = count(children)
async function getSplitTextNodes(page) {
  return page.$$eval('.target *', (splitNodes) =>
    splitNodes.map((node) => ({
      element: node.outerHTML,
      position: node.style.position,
    }))
  )
}

const Template = (options) => ({
  Component: Example,
  props: { children, options },
})

export const NotSplit = Template.bind({})
NotSplit.args = { types: 'none' }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = {
  types: 'lines, words, chars',
  position: 'absolute',
}
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
    // Nested link element...
    // - is an immediate child of a line element
    // - contains a single word element, which contains 9 character elements
    expect((await page.$$('.target > .line > a')).length).toEqual(1)
    expect((await page.$$('a > .word')).length).toEqual(1)
    expect((await page.$$('a > .word > .char')).length).toEqual(9)

    // nested `<strong>` element...
    // - is an immediate child the line element
    // - contains two word elements, which contain a total of 14 characters
    expect((await page.$$('.target > .line > strong')).length).toEqual(1)
    expect((await page.$$('strong > .word')).length).toEqual(2)
    expect((await page.$$('strong > .word > .char')).length).toEqual(14)

    // All child elements are set to absolute position
    const nodes = await getSplitTextNodes(page)
    nodes.forEach((node) => expect(node.position).toEqual('absolute'))
  },
}

export const SplitLinesAndWords = Template.bind({})
SplitLinesAndWords.args = { types: 'lines, words', position: 'absolute' }
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

    // All child elements are set to absolute position
    const nodes = await getSplitTextNodes(page)
    nodes.forEach((node) => expect(node.position).toEqual('absolute'))
  },
}

export const SplitWordsAndChars = Template.bind({})
SplitWordsAndChars.args = { types: 'words, chars', position: 'absolute' }
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

    // All child elements are set to absolute position
    const nodes = await getSplitTextNodes(page)
    nodes.forEach((node) => expect(node.position).toEqual('absolute'))
  },
}

export const SplitWords = Template.bind({})
SplitWords.args = { types: 'words', position: 'absolute' }
SplitWords.parameters = {
  async puppeteerTest(page) {
    // Total number of line, word, and character elements is correct
    expect((await page.$$('.target .line')).length).toEqual(0)
    expect((await page.$$('.target .word')).length).toEqual(words)
    expect((await page.$$('.target .char')).length).toEqual(0)

    // Nested link element(s)
    // Are immediate children of line element
    // Contain a total of two word elements, which contain a total of 13
    // character elements
    expect((await page.$$('.target > a')).length).toEqual(1)
    expect((await page.$$('.target a > .word')).length).toEqual(1)

    // nested `<strong>` element...
    // - is an immediate child the target element
    // - contains two word elements, which contains a total of 14 characters
    expect((await page.$$('.target > strong')).length).toEqual(1)
    expect((await page.$$('strong > .word')).length).toEqual(2)

    // -> All child elements are set to absolute position
    const nodes = await getSplitTextNodes(page)
    nodes.forEach((node) => expect(node.position).toEqual('absolute'))
  },
}
