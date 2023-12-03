import getTemplate from './helpers/getTemplate'
import count from './helpers/count'
import { baseArgTypes } from './constants'

const children = `<a href="#" target="_blank">SplitType</a> now fully supports <strong>nested elements</strong>`

export default {
  title: 'Tests/Nested Elements (Absolute)',
  argTypes: { ...baseArgTypes },
}

// Expected results
// Number of lines (when width of target element is >= 700px )
const lines = 1
const { words, chars, plainWords } = count(children)
async function getSplitTextNodes(page) {
  return page.$$eval('.target *', (splitNodes) =>
    splitNodes.map((node) => ({
      element: node.outerHTML,
      position: node.style.position,
    }))
  )
}

const Template = getTemplate({ children })

export const NotSplit = Template.bind({})
NotSplit.args = { types: 'none' }

export const SplitLinesWordsAndChars = Template.bind({})
SplitLinesWordsAndChars.args = {
  types: 'lines, words, chars',
  absolute: true,
}

export const SplitLinesAndWords = Template.bind({})
SplitLinesAndWords.args = { types: 'lines, words', absolute: true }

export const SplitLinesAndChars = Template.bind({})
SplitLinesAndChars.args = { types: 'lines, chars', absolute: true }
SplitLinesAndChars.parameters = {}

export const SplitWordsAndChars = Template.bind({})
SplitWordsAndChars.args = { types: 'words, chars', absolute: true }

export const SplitWords = Template.bind({})
SplitWords.args = { types: 'words', absolute: true }
