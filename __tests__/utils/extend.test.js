import extend from '../../lib/utils/extend'

describe('utils.extend(object)', () => {
  it(`Returns a shallow copy of given object`, () => {
    const target = { a: 'foo', b: 'bar' }
    expect(extend(target)).toEqual(target)
    expect(extend(target)).not.toBe(target)
  })

  it(`If object is null/undefined, returns an empty object`, () => {
    expect(extend(undefined)).toEqual({})
    expect(extend(null)).toEqual({})
  })
})

describe('utils.extend(target, object)', () => {
  it('Returns a new object, does mutate properties of source object', () => {
    const target = { a: 'foo', b: 'bar' }
    const object = { b: 'fiz' }
    expect(extend(target, object)).toEqual({ a: 'foo', b: 'fiz' })
    expect(extend(target, object)).not.toBe(target)
    // Check that `target` and `source` were not mutated
    expect(target).toEqual({ a: 'foo', b: 'bar' })
    expect(object).toEqual({ b: 'fiz' })
  })
  it('Returns a new object', () => {
    const target = { a: 'foo', b: 'bar' }
    expect(extend(target, {})).toEqual(target)
    expect(extend(target, {})).not.toBe(target)
  })
  it('Merges object with target, excluding properties that do not exist on target', () => {
    const target = { a: 'foo', b: 'bar' }
    const object = { b: 'fiz', c: 'zip' }
    expect(extend(target, object)).toEqual({ a: 'foo', b: 'fiz' })
  })
})
