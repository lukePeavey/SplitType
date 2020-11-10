import isNode from '../../lib/utils/isNode'

describe('utils.isNode(value)', () => {
  it(`Returns true if value is an Element, Text, or DocumentFragment`, () => {
    const { body } = document
    const html = document.querySelector('html')
    const fragment = document.createDocumentFragment()
    const div = document.createElement('div')
    const svg = document.createElement('svg')
    const rect = document.createElement('rect')
    const text = document.createTextNode('text')
    expect(isNode(body)).toBe(true)
    expect(isNode(html)).toBe(true)
    expect(isNode(fragment)).toBe(true)
    expect(isNode(div)).toBe(true)
    expect(isNode(svg)).toBe(true)
    expect(isNode(rect)).toBe(true)
    expect(isNode(text)).toBe(true)
  })
  it(`Returns false for all other values`, () => {
    expect(isNode(document)).toBe(false)
    expect(isNode(null)).toBe(false)
    expect(isNode(undefined)).toBe(false)
    expect(isNode({})).toBe(false)
    expect(isNode([])).toBe(false)
    expect(isNode(window)).toBe(false)
  })
})
