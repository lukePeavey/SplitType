import flatten from '../../lib/utils/flatten'
import createElement from '../../lib/utils/createElement'

const wrapper = document.createElement('main')
document.body.appendChild(wrapper)

const querySelectorAll = document.querySelectorAll.bind(document)
const getElementsByTagName = document.querySelectorAll.bind(document)

const elements = [
  createElement('div'),
  createElement('div'),
  createElement('span'),
  createElement('span'),
]

elements.forEach(element => wrapper.appendChild(element))

describe('utils.flatten(value)', () => {
  it('Flattens an array containing NodeLists and HTMLCollections', () => {
    const array = [querySelectorAll('div'), getElementsByTagName('span')]
    expect(flatten(array)).toEqual(elements)
  })
  it('Flattens an array containing a mix of objects and array-like objects', () => {
    const object = { foo: 'bar' }
    const childArray = [1, 2, 3]
    const array = [childArray, object]
    expect(flatten(array)).toEqual([...childArray, object])
  })
  
  it(`If \`value\` is not array-like, behaves likes Array.of()`, () => {
    const object = { foo: 'bar' }
    expect(flatten(object)).toEqual(Array.of(object))
  })
})
