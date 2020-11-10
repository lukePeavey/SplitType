import getTargetElements from '../../lib/utils/getTargetElements'
import createElement from '../../lib/utils/createElement'

const wrapper = document.createElement('main')
document.body.appendChild(wrapper)
const querySelectorAll = document.querySelectorAll.bind(document)
const getElementsByTagName = document.querySelectorAll.bind(document)

// Create three divs with the following IDs
const divs = ['one', 'two', 'three'].map((id) => {
  return createElement('div', { id, class: 'text' })
})

// Create three spans with the following IDs
const spans = ['four', 'five', 'six'].map((id) => {
  return createElement('span', { id, class: 'text' })
})

// An array of all six elements
const elements = [...divs, ...spans]

elements.forEach((element) => wrapper.appendChild(element))

describe('utils.getTargetElements("#id")', () => {
  it(`Returns an array containing the matching element`, () => {
    expect(getTargetElements('#one')).toEqual([elements[0]])
  })
  it(`Returns an empty array if no elements match`, () => {
    expect(getTargetElements('#foobar')).toEqual([])
  })
})

describe(`utils.getTargetElements(".className")`, () => {
  it(`Returns an array of elements matching the given className`, () => {
    expect(getTargetElements('.text')).toEqual(elements)
  })

  it(`Returns an empty array if no elements match`, () => {
    expect(getTargetElements('.foobar')).toEqual([])
  })
})

describe(`utils.getTargetElements("tagName")`, () => {
  it(`Returns an array of elements matching the given tagName`, () => {
    expect(getTargetElements('span')).toEqual(spans)
    expect(getTargetElements('div')).toEqual(divs)
  })
  it(`Returns an empty array if no elements match`, () => {
    expect(getTargetElements('article')).toEqual([])
  })
})

describe(`utils.getTargetElements(element)`, () => {
  it(`Returns an array containing the given element(s)`, () => {
    const element = elements[0]
    expect(getTargetElements(element)).toEqual([element])
  })
  it(`Only includes HTML elements in the result`, () => {
    // non-elements objects are ignored
    expect(getTargetElements({ foo: 'bar' })).toEqual([])
    // Falsy values are ignored
    expect(getTargetElements(null)).toEqual([])
  })
})

describe(`utils.getTargetElements(ArrayLike<element>)`, () => {
  it(`Only includes HTMLElements in the result`, () => {
    expect(getTargetElements([{ foo: 'bar' }])).toEqual([])
    expect(getTargetElements([null, [null]])).toEqual([])
    expect(getTargetElements([elements, { foo: 'bar' }])).toEqual(elements)
  })
  it(`Converts array-like objects to an array of elements`, () => {
    expect(getTargetElements(querySelectorAll('div'))).toEqual(divs)
    expect(getTargetElements(getElementsByTagName('span'))).toEqual(spans)
  })

  it(`Flattens a nested arrays containing multiple collections`, () => {
    const element = document.createElement('span')
    const nodeList = querySelectorAll('div')
    const nestedArray = [ querySelectorAll('div'), element]
    expect(getTargetElements(nodeList)).toEqual(divs)
    expect(getTargetElements(nestedArray)).toEqual([...divs, element])
  })
})
