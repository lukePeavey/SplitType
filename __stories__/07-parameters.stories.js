import getTemplate from './helpers/getTemplate'

const text = `Hello World!`

export default {
  title: 'SplitType options',
  argTypes: {
    children: { control: 'text' },
    types: { control: 'array' },
  },
}

const wordCount = text.split(' ').length
const charCount = text.replace(/\s+/g, '').split('').length

const Template = getTemplate({ children: text })

export const SplitClass = Template.bind({})
SplitClass.args = {
  lineClass: 'my-line',
  wordClass: 'my-word',
  charClass: 'my-char',
  splitClass: 'split',
}

SplitClass.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('.split.my-line')).length).toEqual(1)
    expect((await page.$$('.split.my-word')).length).toEqual(wordCount)
    expect((await page.$$('.split.my-char')).length).toEqual(charCount)
  },
}

export const customTag = Template.bind({})
customTag.args = {
  tagName: 'span',
}

customTag.parameters = {
  async puppeteerTest(page) {
    expect((await page.$$('span.line')).length).toEqual(1)
    expect((await page.$$('span.word')).length).toEqual(wordCount)
    expect((await page.$$('span.char')).length).toEqual(charCount)
  },
}
