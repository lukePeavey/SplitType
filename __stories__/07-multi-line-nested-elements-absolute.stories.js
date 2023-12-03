import getTemplate from './helpers/getTemplate'
import count from './helpers/count'
import { baseArgTypes } from './constants'

const children = `<a href="#" target="_blank">SplitType</a> now supports <strong>nested elements</strong> like <code>&lt;span&gt;</code>, <code>&lt;strong&gt;</code>, and <code>&lt;em&gt;</code>. You can also use interactive elements like a <button>button</button> or <a href="#" target="_blank">link</a> inside your split text.`

export default {
  title: 'Tests/Multi-line Nested Elements (Absolute)',
  argTypes: { ...baseArgTypes },
}

const lines = 4
const { words: actualWords, chars, plainWords } = count(children)
const words = actualWords + 3

async function getSplitTextNodes(page) {
  return page.$$eval('.target *', (splitNodes) =>
    splitNodes.map((node) => ({
      element: node.outerHTML,
      position: node.style.position,
    }))
  )
}

// Create the story template
const Template = getTemplate({ children, className: 'fixed' })

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
SplitLinesAndChars.args = { types: 'lines, chars' }
SplitLinesAndChars.parameters = {}

export const SplitWordsAndChars = Template.bind({})
SplitWordsAndChars.args = { types: 'words, chars', absolute: true }

export const SplitWords = Template.bind({})
SplitWords.args = { types: 'words', absolute: true }
