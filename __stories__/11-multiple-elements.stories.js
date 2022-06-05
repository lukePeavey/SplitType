import getTemplate from './helpers/getTemplate'
import { baseArgTypes } from './constants'

const children = [
  `Split Typography for Animation`,
  `We can target multiple elements`,
]

export default {
  title: 'Tests/Multiple Target Elements',
  argTypes: {
    ...baseArgTypes,
    splitClass: { control: 'text' },
    lineClass: { control: 'text' },
    wordClass: { control: 'text' },
    charClass: { control: 'text' },
  },
}

const Template = getTemplate({ children })

export const NotSplit = Template.bind({})
NotSplit.args = { types: 'none' }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = { types: 'lines, words, chars' }
SplitLinesWordsAndChars.parameters = {}

export const SplitLinesAndWords = Template.bind({})
SplitLinesAndWords.args = { types: 'lines, words' }
SplitLinesAndWords.parameters = {}

export const SplitWordsAndChars = Template.bind({})
SplitWordsAndChars.args = { types: 'words, chars' }
SplitWordsAndChars.parameters = {}

export const SplitLines = Template.bind({})
SplitLines.args = { types: 'lines' }
SplitLines.parameters = {}

export const SplitWords = Template.bind({})
SplitWords.args = { types: 'words' }
SplitWords.parameters = {}

export const SplitChars = Template.bind({})
SplitChars.args = { types: ['chars'] }
SplitChars.parameters = {}
