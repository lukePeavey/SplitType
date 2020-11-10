import toChars from '../../lib/utils/toChars'

describe('utils.toChars(value)', () => {
  it(`Splits a string into characters`, () => {
    expect(toChars('foo')).toEqual(['f', 'o', 'o'])
    expect(toChars('foo bar')).toEqual(['f', 'o', 'o', ' ', 'b', 'a', 'r'])
    expect(toChars('f-o-o', /-/)).toEqual(['f', 'o', 'o'])
    expect(toChars('f-o-o', '-')).toEqual(['f', 'o', 'o'])
    expect(toChars()).toEqual([])
  })
})