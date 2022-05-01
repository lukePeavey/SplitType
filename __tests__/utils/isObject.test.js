import isObject from '../../lib/utils/isObject'

describe('utils.isObject(value)', () => {
  it(`Returns true value is an object or array`, () => {
    expect(isObject([])).toBe(true)
    expect(isObject(Object())).toBe(true)
    expect(isObject(document)).toBe(true)
  })
  it(`Returns false if value is a number, string, function, boolean, null, or undefined`, () => {
    expect(isObject(() => {})).toBe(false)
    expect(isObject(null)).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject('string')).toBe(false)
    expect(isObject(1)).toBe(false)
    expect(isObject(Boolean())).toBe(false)
  })
})
