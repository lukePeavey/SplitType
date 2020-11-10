import isPlainObject from '../../lib/utils/isPlainObject'

describe(`utils.isPlainObject(value)`, () => {
  it(`Returns true if value is an Object`, () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject(Object.create(Object.prototype))).toBe(true)
    expect(isPlainObject(Object.create({}))).toBe(true)
  })
  it(`Returns false for all other values`, () => {
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject(String())).toBe(false)
    expect(isPlainObject(() => {})).toBe(false)
    expect(isPlainObject(window)).toBe(false)
  })
})