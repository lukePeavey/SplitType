import getTemplate from './helpers/getTemplate'
import { baseArgTypes } from './constants'

const children = `
This is the first line. <br>
Followed by the second line. <br>
Then the last one.`

const lineCount = 3
const wordCount = children.replace(/<br\s*\/?>/g, '').split(' ').length
const charCount = children.replace(/(<br\s*\/?>)|\s+/g, '').split('').length

export default {
  title: 'Tests/Explicit Line Breaks',
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
SplitLinesAndChars.args = { types: 'lines, chars' }
SplitLinesAndChars.parameters = {}

export const SplitWordsAndChars = Template.bind({})
SplitWordsAndChars.args = { types: 'words, chars' }

export const SplitLines = Template.bind({})
SplitLines.args = { types: 'lines' }

export const SplitWords = Template.bind({})
SplitWords.args = { types: 'words' }
