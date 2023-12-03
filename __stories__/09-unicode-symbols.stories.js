import getTemplate from './helpers/getTemplate'
import toChars from '../lib/utils/toChars'
import { baseArgTypes } from './constants'

const children = 'Foo😀 Bar👌'

const lineCount = 1
const wordCount = children.split(' ').length
const charCount = toChars(children.replace(/\s/g, '')).length

export default {
  title: 'Tests/Unicode Symbols',
  argTypes: { ...baseArgTypes },
}

const Template = getTemplate({ children })

export const NotSplit = Template.bind({})
NotSplit.args = { types: 'none' }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = { types: 'lines, words, chars' }

export const SplitLines = Template.bind({})
SplitLines.args = { types: 'lines' }

export const SplitWords = Template.bind({})
SplitWords.args = { types: 'words' }

export const SplitChars = Template.bind({})
SplitChars.args = { types: ['chars'] }
