import getTemplate from './helpers/getTemplate'
import { baseArgTypes } from './constants'

const children = `Hello World!`

export default {
  title: 'Tests/Custom ClassNames',
  argTypes: {
    ...baseArgTypes,
    splitClass: { control: 'text' },
    lineClass: { control: 'text' },
    wordClass: { control: 'text' },
    charClass: { control: 'text' },
  },
}

const wordCount = children.split(' ').length
const charCount = children.replace(/\s+/g, '').split('').length

const Template = getTemplate({ children })

export const SplitClass = Template.bind({})
SplitClass.args = {
  types: 'lines, words, chars',
  lineClass: 'my-line',
  wordClass: 'my-word',
  charClass: 'my-char',
  splitClass: 'split',
}
