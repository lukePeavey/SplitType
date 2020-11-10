import toArray from '../../lib/utils/toArray'
import createElement from '../../lib/utils/createElement'

const range = (n) => Array(n).fill()
const children = range(3).map(() => createElement('span'))
const parent = createElement('div', { children })

describe(`utils.toArray(value)`, () => {
  it(`If value is an Array, returns the original array`, () => {
    const array = [1, 2, 3]
    expect(toArray(array)).toBe(array)
  })

  it(`If value is an ArrayLike object, converts it to an array`, () => {
    expect(toArray(children)).toEqual(children)
    expect(toArray(parent.querySelectorAll('span'))).toEqual(children)
  })

  it(`If value is null/undefined, returns an empty array`, () => {
    expect(toArray(null)).toEqual([])
    expect(toArray(undefined)).toEqual([])
  })

  it(`For all other objects, behaves like Array.of()`, () => {
    const object = {foo: 'bar'}
    expect(toArray(object)).toEqual(Array.of(object))
    expect(toArray(parent)).toEqual(Array.of(parent))
    expect(toArray('foo')).toEqual(Array.of('foo'))
  })
})
