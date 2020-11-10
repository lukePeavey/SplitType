import toWords from '../../lib/utils/toWords'

const words = ['one', 'two', 'three']
const emojiWords = ['👍', '😀', '🤡']

describe('utils.toWords(string)', () => {
  it(`Splits string into words`, () => {
    expect(toWords('one two three')).toEqual(words)
    expect(toWords('👍 😀 🤡')).toEqual(emojiWords)
  })
})
describe('utils.toWords(string, separator)', () => {
  it(`Splits string into array of words using a custom separator`, () => {
    expect(toWords('one-two-three', '-')).toEqual(words)
    expect(toWords('👍-😀-🤡', '-')).toEqual(emojiWords)
  })

  it(`Splits string into an array of words using a regex separator`, () => {
    expect(toWords('one<two>three', /[<>]/)).toEqual(words)
  })

  it(`Splits string with unicode characters into an array of words using a 
  regex separator`, () => {
    expect(toWords('👍<😀>🤡', /[<>]/)).toEqual(emojiWords)
  })
})
