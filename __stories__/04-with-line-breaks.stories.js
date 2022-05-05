import getTemplate from './helpers/getTemplate'

const text = `
This is the first line. <br>
Followed by the second line. <br>
Then the last one.`

const lineCount = 3
const wordCount = text.replace(/<br\s*\/?>/g, '').split(' ').length
const charCount = text.replace(/(<br\s*\/?>)|\s+/g, '').split('').length

export default {
  title: 'With Line Breaks',
  argTypes: {
    children: { control: 'text' },
    types: { control: 'array' },
  },
}

const Template = getTemplate({ children: text })

export const NotSplit = Template.bind({})
NotSplit.args = { types: [] }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = { types: ['lines', 'words', 'chars'] }
SplitLinesWordsAndChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(lineCount)
    expect((await page.$$('.line > .word')).length).toEqual(wordCount)
    expect((await page.$$('.word > .char')).length).toEqual(charCount)
  },
}

export const SplitLines = Template.bind({})
SplitLines.args = { types: ['lines'] }
SplitLines.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(lineCount)
    expect((await page.$$('.word')).length).toEqual(0)
    expect((await page.$$('.char')).length).toEqual(0)
  },
}

export const SplitWords = Template.bind({})
SplitWords.args = { types: ['words'] }
SplitWords.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.line')).length).toEqual(0)
    expect((await page.$$('.target > .word')).length).toEqual(wordCount)
    expect((await page.$$('.char')).length).toEqual(0)
  },
}

export const SplitLinesAndWords = Template.bind({})
SplitLinesAndWords.args = { types: ['lines', 'words'] }
SplitLinesAndWords.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(lineCount)
    expect((await page.$$('.line > .word')).length).toEqual(wordCount)
    expect((await page.$$('.char')).length).toEqual(0)
  },
}

export const SplitLinesAndChars = Template.bind({})
SplitLinesAndChars.args = { types: ['lines', 'chars'] }
SplitLinesAndChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.target > .line')).length).toEqual(lineCount)
    expect((await page.$$('.word')).length).toEqual(0)
    expect((await page.$$('.line > .char')).length).toEqual(charCount)
  },
}
