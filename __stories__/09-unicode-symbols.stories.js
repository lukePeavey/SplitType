import getTemplate from './helpers/getTemplate'
import toChars from '../lib/utils/toChars'
import { baseArgTypes } from './constants'

const text = 'Foo😀 Bar👌'

const lineCount = 1
const wordCount = text.split(' ').length
const charCount = toChars(text.replace(/\s/g, '')).length

export default {
  title: 'Unicode Symbols',
  argTypes: { ...baseArgTypes },
}

const Template = getTemplate({ children: text })

export const NotSplit = Template.bind({})
NotSplit.args = { types: 'none' }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = { types: 'lines, words, chars' }
SplitLinesWordsAndChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(lineCount)
    expect((await page.$$('.line > .word')).length).toEqual(wordCount)
    expect((await page.$$('.word > .char')).length).toEqual(charCount)
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
    expect((await page.$$('.target > .word')).length).toEqual(wordCount)
    expect((await page.$$('.char')).length).toEqual(0)
  },
}

export const SplitChars = Template.bind({})
SplitChars.args = { types: ['chars'] }
SplitChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.line')).length).toEqual(0)
    expect((await page.$$('.word')).length).toEqual(0)
    expect((await page.$$('.target > .char')).length).toEqual(charCount)
  },
}
