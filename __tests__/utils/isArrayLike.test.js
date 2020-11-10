import isArrayLike from '../../lib/utils/isArrayLike'

describe('utils.isArrayLike(value)', () => {
  it(`Returns true if value is an array`, () => {
    expect(isArrayLike(new Array(1))).toBe(true)
  })
  it(`Returns true if value is a NodeLis or HTMLCollection`, () => {
    const div = document.createElement('div')
    div.innerHTML = '<p>a</p><p>b</p>'
    expect(isArrayLike(document.querySelectorAll('*'))).toBe(true)
    expect(isArrayLike(document.getElementsByTagName('body'))).toBe(true)
    expect(isArrayLike(div.children)).toBe(true)
  })
  it(`Returns false if value is not ArrayLike`, () => {
    expect(isArrayLike({})).toBe(false)
    expect(isArrayLike('string')).toBe(false)
    expect(isArrayLike(function f() {})).toBe(false)
  })
})
