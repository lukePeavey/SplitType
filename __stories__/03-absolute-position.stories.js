import getTemplate from './helpers/getTemplate'
import { baseArgTypes } from './constants'

const children = `Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.`

const lineCount = 3
const wordCount = children.split(' ').length
const charCount = children.replace(/\s+/g, '').split('').length

// Story config
export default {
  title: 'Tests/Absolute Position',
  argTypes: { ...baseArgTypes },
}

// Story template
const Template = getTemplate({ children })

export const NotSplit = Template.bind({})
NotSplit.args = { types: 'none', absolute: true }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = {
  types: 'lines, words, chars',
  absolute: true,
}

export const SplitLinesAndWords = Template.bind({})
SplitLinesAndWords.args = { types: 'lines, words', absolute: true }

export const SplitLinesAndChars = Template.bind({})
SplitLinesAndChars.args = { types: 'lines, chars', absolute: true }

export const SplitWordsAndChars = Template.bind({})
SplitWordsAndChars.args = { types: 'words, chars', absolute: true }

export const SplitLines = Template.bind({})
SplitLines.args = { types: 'lines', absolute: true }

export const SplitWords = Template.bind({})
SplitWords.args = { types: 'words', absolute: true }
