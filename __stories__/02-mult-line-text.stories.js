import getTemplate from './helpers/getTemplate'
import { baseArgTypes } from './constants'

const children = `Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.`

const lineCount = 3
const wordCount = children.split(' ').length
const charCount = children.replace(/\s+/g, '').split('').length

export default {
  title: 'Tests/Multi-line text',
  argTypes: { ...baseArgTypes },
}

const Template = getTemplate({ children })

export const NotSplit = Template.bind({})
NotSplit.args = { types: 'none' }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = { types: 'lines, words, chars' }

export const SplitLinesAndWords = Template.bind({})
SplitLinesAndWords.args = { types: 'lines, words' }

export const SplitLinesAndChars = Template.bind({})
SplitLinesAndChars.args = { types: 'lines, chars', absolute: false }

export const SplitWordsAndChars = Template.bind({})
SplitWordsAndChars.args = { types: 'words, chars' }

export const SplitLines = Template.bind({})
SplitLines.args = { types: 'lines' }

export const SplitWords = Template.bind({})
SplitWords.args = { types: 'words' }
