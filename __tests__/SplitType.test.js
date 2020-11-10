import SplitType from '../lib/SplitType'
import createElement from '../lib/utils/createElement'

describe('SplitType', () => {
  const elements = [
    createElement('div', { textContent: 'One Two', class: 'text' }),
    createElement('div', { textContent: 'Three Four', class: 'text' }),
  ]
  elements.forEach((element) => document.body.appendChild(element))

  it('Matches snapshot with default options', () => {
    const text = new SplitType('.text')
    expect(text).toMatchSnapshot()
  })
  it(`Matches snapshot with { types: "words, chars" }`, () => {
    const text = new SplitType('.text', { types: 'words, chars' })
    expect(text).toMatchSnapshot()
  })
})
