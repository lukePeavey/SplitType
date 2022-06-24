import getTemplate from './helpers/getTemplate'
import count from './helpers/count'
import { baseArgTypes } from './constants'

const children = `
<!-- COMMENT -->
<!-- COMMENT -->
Typography is the art and technique of arranging
<!-- COMMENT -->
<!-- COMMENT -->
type to make written language legible, readable,
<!-- COMMENT -->
<!-- COMMENT -->
and appealing when displayed.
<!-- COMMENT -->
<!-- COMMENT -->
`

const lineCount = 3
const { words, chars } = count(children)

export default {
  title: 'Tests/With HTML Comments',
  argTypes: { ...baseArgTypes },
}

const Template = getTemplate({ children })

export const NotSplit = Template.bind({})
NotSplit.args = { types: 'none' }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = { types: 'lines, words, chars' }
SplitLinesWordsAndChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(lineCount)
    expect((await page.$$('.line > .word')).length).toEqual(words)
    expect((await page.$$('.word > .char')).length).toEqual(chars)
  },
}

export const SplitLinesAndWords = Template.bind({})
SplitLinesAndWords.args = { types: 'lines, words' }
SplitLinesAndWords.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(lineCount)
    expect((await page.$$('.line > .word')).length).toEqual(words)
    expect((await page.$$('.char')).length).toEqual(0)
  },
}

export const SplitLinesAndChars = Template.bind({})
SplitLinesAndChars.args = { types: 'lines, chars', absolute: false }
SplitLinesAndChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(lineCount)
    expect((await page.$$('.line > .char')).length).toEqual(chars)
  },
}

export const SplitWordsAndChars = Template.bind({})
SplitWordsAndChars.args = { types: 'words, chars' }
SplitWordsAndChars.parameters = {
  async puppeteerTest(page) {
    // Should not contain any line elements
    expect((await page.$$('.line')).length).toEqual(0)
    //
    expect((await page.$$('.target > .word')).length).toEqual(words)
    expect((await page.$$('.word > .char')).length).toEqual(chars)
  },
}

export const SplitLines = Template.bind({})
SplitLines.args = { types: 'lines' }
SplitLines.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(lineCount)
    expect((await page.$$('.word')).length).toEqual(0)
    expect((await page.$$('.char')).length).toEqual(0)
  },
}

export const SplitWords = Template.bind({})
SplitWords.args = { types: 'words' }
SplitWords.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.line')).length).toEqual(0)
    expect((await page.$$('.target > .word')).length).toEqual(words)
    expect((await page.$$('.char')).length).toEqual(0)
  },
}
