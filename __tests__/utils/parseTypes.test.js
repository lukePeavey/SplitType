import parseTypes from '../../lib/utils/parseTypes'

describe('utils.parseTypes(value)', () => {
  it(`Returns \`{lines: boolean, words: boolean, chars: boolean}\``, () => {
    const expectedShape = expect.objectContaining({
      lines: expect.any(Boolean),
      words: expect.any(Boolean),
      chars: expect.any(Boolean),
    })
    expect(parseTypes()).toEqual(expectedShape)
    expect(parseTypes('')).toEqual(expectedShape)
    expect(parseTypes('lines, words, chars')).toEqual(expectedShape)
  })

  it(`The value of each key is \`true\` if the given string contains 
  that key`, () => {
    expect(parseTypes('lines, words')).toEqual({
      none: false,
      lines: true,
      words: true,
      chars: false,
    })
    expect(parseTypes('lines')).toEqual({
      none: false,
      lines: true,
      words: false,
      chars: false,
    })
    expect(parseTypes('lines, chars')).toEqual({
      none: false,
      lines: true,
      words: false,
      chars: true,
    })
    expect(parseTypes([])).toEqual({
      none: true,
      lines: false,
      words: false,
      chars: false,
    })
  })
})
