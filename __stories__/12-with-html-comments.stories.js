import getTemplate from './helpers/getTemplate'
import count from './helpers/count'
import { baseArgTypes } from './constants'

const children = `
<!-- COMMENT -->
<!-- COMMENT -->
Typography is the art and technique of arranging
<!-- COMMENT -->
<!-- COMMENT -->
type to make written language legible, readable,
<!-- COMMENT -->
<!-- COMMENT -->
and appealing when displayed.
<!-- COMMENT -->
<!-- COMMENT -->
`

const lineCount = 3
const { words, chars } = count(children)

export default {
  title: 'Tests/With HTML Comments',
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
