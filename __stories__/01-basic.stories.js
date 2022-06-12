import getTemplate from './helpers/getTemplate'
import { baseArgTypes } from './constants'
import count from './helpers/count'

const children = `Split Typography for Animation`
const { words, chars } = count(children)

export default {
  title: 'Tests/Basic',
  argTypes: { ...baseArgTypes },
  parameters: {
    docs: {
      page: null,
    },
  },
}

const Template = getTemplate({ children })

export const NotSplit = Template.bind({})
NotSplit.args = { types: 'none' }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = { types: 'lines, words, chars' }
SplitLinesWordsAndChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(1)
    expect((await page.$$('.line > .word')).length).toEqual(words)
    expect((await page.$$('.word > .char')).length).toEqual(chars)
  },
}

export const SplitLinesAndWords = Template.bind({})
SplitLinesAndWords.args = { types: 'lines, words' }
SplitLinesAndWords.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(1)
    expect((await page.$$('.line > .word')).length).toEqual(words)
    expect((await page.$$('.char')).length).toEqual(0)
  },
}

export const SplitLinesAndChars = Template.bind({})
SplitLinesAndChars.args = { types: 'lines, chars' }
SplitLinesAndChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(1)
    expect((await page.$$('.line > .char')).length).toEqual(chars)
  },
}

export const SplitWordsAndChars = Template.bind({})
SplitWordsAndChars.args = { types: 'words, chars' }
SplitWordsAndChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.line')).length).toEqual(0)
    expect((await page.$$('.target > .word')).length).toEqual(words)
    expect((await page.$$('.word > .char')).length).toEqual(chars)
  },
}

export const SplitLines = Template.bind({})
SplitLines.args = { types: 'lines' }
SplitLines.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(1)
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

export const SplitChars = Template.bind({})
SplitChars.args = { types: 'chars' }
SplitChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.line')).length).toEqual(0)
    expect((await page.$$('.word')).length).toEqual(0)
    expect((await page.$$('.target > .char')).length).toEqual(chars)
  },
}
