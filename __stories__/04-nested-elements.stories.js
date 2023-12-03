import getTemplate from './helpers/getTemplate'
import count from './helpers/count'
import { baseArgTypes } from './constants'

const children = `<a href="#" target="_blank">SplitType</a> now fully supports <strong>nested elements</strong>`

export default {
  title: 'Tests/Nested Elements',
  argTypes: { ...baseArgTypes },
}

// Expected results
// number of words that are direct child of target element
// Number of lines (when width of target element is >= 700px )
const lineCount = 1
// Total number of words and characters
const { words, chars, plainWords } = count(children)

// Create the story template
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

export const SplitWords = Template.bind({})
SplitWords.args = { types: 'words' }
