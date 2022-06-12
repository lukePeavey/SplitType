import createElement from '../../lib/utils/createElement'

describe(`utils.createElement(name)`, () => {
  it(`Returns an element with the given name`, () => {
    expect(createElement('div')).toBeInstanceOf(HTMLDivElement)
    expect(createElement('p').nodeName).toEqual('P')
  })
})

describe(`utils.createElement(name, attributes)`, () => {
  it(`Creates an element with textContent`, () => {
    const children = `This is some text content`
    const element = createElement('div', { children })
    expect(element.textContent).toEqual(children)
  })
  it(`Creates an element with textContent including emojis`, () => {
    const children = `Text content with 🐳 🍔 ❤️`
    const element = createElement('div', { children })
    expect(element.textContent).toEqual(children)
  })
  it(`Creates an element with children`, () => {
    const children = [1, 2, 3].map((i) => {
      const element = document.createElement('p')
      element.textContent = `paragraph ${i}`
      return element
    })
    const element = createElement('div', { children })
    expect(element.querySelectorAll('p').length).toEqual(3)
  })
})
