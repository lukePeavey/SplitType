import getTemplate from './helpers/getTemplate'

const text = `Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The term typography is also applied to the style, arrangement, and appearance of the letters, numbers, and symbols created by the process.`
const lineCount = 5
const wordCount = text.split(' ').length
const charCount = text.replace(/\s+/g, '').split('').length

// Story config
export default {
  title: 'With Absolute Position',
  argTypes: {
    children: { control: 'text' },
    types: { control: 'array' },
    absolute: { control: 'boolean' },
  },
}

// Create the template used to render stories in this section
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

export const SplitChars = Template.bind({})
SplitChars.args = { types: ['chars'] }
SplitChars.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.line')).length).toEqual(0)
    expect((await page.$$('.word')).length).toEqual(0)
    expect((await page.$$('.target > .char')).length).toEqual(charCount)
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
