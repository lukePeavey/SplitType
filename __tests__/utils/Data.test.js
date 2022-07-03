import * as data from '../../lib/Data'

const owner = document.createElement('div')

afterEach(() => {
  data.remove(owner)
})

describe(`Data(owner)`, () => {
  it(`data.get(undefined) returns empty object`, () => {
    expect(data.get(undefined)).toEqual({})
  })
  it(`data.set(owner, key, value) works as expected`, () => {
    // Make sure data store is empty at start of test
    expect(data.cache).toEqual({})
    data.set(owner, 'foo', 'bar')
    expect(data.cache[owner[data.expando]]).toEqual({ foo: 'bar' })
    data.set(owner, 'hello', 'world')
    expect(data.cache[owner[data.expando]]).toEqual({
      foo: 'bar',
      hello: 'world',
    })
  })
  it(`data.set(owner, objectMap) works as expected`, () => {
    // Make sure data store is empty at start of test
    expect(data.cache).toEqual({})
    data.set(owner, {
      foo: 'bar',
      hello: 'world',
    })
    expect(data.cache[owner[data.expando]]).toEqual({
      foo: 'bar',
      hello: 'world',
    })
  })

  it(`data.get(owner) returns data object `, () => {
    // Make sure data store is empty at start of test
    expect(data.get(owner)).toEqual({})
    // Set multiple properties by passing an object as the second arg
    data.set(owner, {
      foo: 'bar',
      hello: 'world',
    })
    // Set an additional property using the (owner, key, value) syntax
    data.set(owner, 'other', 'value')
    // data.get(owner) should return an object with the the expected props
    expect(data.get(owner)).toEqual({
      foo: 'bar',
      hello: 'world',
      other: 'value',
    })
  })
})
