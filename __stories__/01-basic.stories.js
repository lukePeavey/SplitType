import getTemplate from './helpers/getTemplate'
import { baseArgTypes } from './constants'

const children = `Split Typography for Animation`

export default {
  title: 'Tests/Basic',
  argTypes: { ...baseArgTypes },
  parameters: {
    docs: {
      page: null,
    },
  },
}

const wordCount = children.split(' ').length
const charCount = children.replace(/\s+/g, '').split('').length

const Template = getTemplate({ children })

export const NotSplit = Template.bind({})
NotSplit.args = { types: 'none' }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = { types: 'lines, words, chars' }
SplitLinesWordsAndChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(1)
    expect((await page.$$('.line > .word')).length).toEqual(wordCount)
    expect((await page.$$('.word > .char')).length).toEqual(charCount)
  },
}

export const SplitLinesAndWords = Template.bind({})
SplitLinesAndWords.args = { types: 'lines, words' }
SplitLinesAndWords.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(1)
    expect((await page.$$('.line > .word')).length).toEqual(wordCount)
    expect((await page.$$('.char')).length).toEqual(0)
  },
}

export const SplitWordsAndChars = Template.bind({})
SplitWordsAndChars.args = { types: 'words, chars' }
SplitWordsAndChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.line')).length).toEqual(0)
    expect((await page.$$('.target > .word')).length).toEqual(wordCount)
    expect((await page.$$('.word > .char')).length).toEqual(charCount)
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
    expect((await page.$$('.target > .word')).length).toEqual(wordCount)
    expect((await page.$$('.char')).length).toEqual(0)
  },
}

export const SplitChars = Template.bind({})
SplitChars.args = { types: 'chars' }
SplitChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.line')).length).toEqual(0)
    expect((await page.$$('.word')).length).toEqual(0)
    expect((await page.$$('.target > .char')).length).toEqual(charCount)
  },
}
