import toChars from '../../lib/utils/toChars'

describe('utils.toChars(value)', () => {
  it(`Splits a string into an array of characters`, () => {
    expect(toChars('foo')).toEqual(['f', 'o', 'o'])
    expect(toChars('foo bar')).toEqual(['f', 'o', 'o', ' ', 'b', 'a', 'r'])
    expect(toChars('f-o-o', /-/)).toEqual(['f', 'o', 'o'])
    expect(toChars('f-o-o', '-')).toEqual(['f', 'o', 'o'])
    expect(toChars()).toEqual([])
  })

  it(`Splits a string containing emojis`, () => {
    expect(toChars('👋🏽😀✂️')).toEqual(['👋🏽', '😀', '✂️'])
    expect(toChars('foo😀')).toEqual(['f', 'o', 'o', '😀'])
  })

  it(`Splits a string containing non-english characters`, () => {
    expect(toChars('ふりが')).toEqual(['ふ', 'り', 'が'])
  })
})

describe('utils.toChars(value, separator)', () => {
  it(`Splits a string using a custom string separator`, () => {
    expect(toChars('f-o-o', '-')).toEqual(['f', 'o', 'o'])
    expect(toChars('👋🏽-😀-✂️', '-')).toEqual(['👋🏽', '😀', '✂️'])
  })

  it(`Splits a string using a RegExp separator pattern`, () => {
    expect(toChars('f-o_o', /-|_/)).toEqual(['f', 'o', 'o'])
    expect(toChars('👋🏽-😀_✂️', /-|_/)).toEqual(['👋🏽', '😀', '✂️'])
  })
})
