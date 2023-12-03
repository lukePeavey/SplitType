import getTemplate from './helpers/getTemplate'
import { baseArgTypes } from './constants'
import count from './helpers/count'

const children = `Split Typography for Animation`
const { words, chars } = count(children)

export default {
  title: 'Tests/Basic',
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

export const SplitWordsAndChars = Template.bind({})
SplitWordsAndChars.args = { types: 'words, chars' }

export const SplitLines = Template.bind({})
SplitLines.args = { types: 'lines' }

export const SplitWords = Template.bind({})
SplitWords.args = { types: 'words' }

export const SplitChars = Template.bind({})
SplitChars.args = { types: 'chars' }
