import createElement from '../../lib/utils/createElement'

describe(`utils.createElement(name)`, () => {
  it(`Returns an element with the given name`, () => {
    expect(createElement('div')).toBeInstanceOf(HTMLDivElement)
    expect(createElement('p').nodeName).toEqual('P')
  })
})

describe(`utils.createElement(name, attributes)`, () => {
  it(`Creates an element with innerHTML`, () => {
    const innerHTML = `<p id="child">text</p>`
    const element = createElement('div', { innerHTML })
    expect(element.querySelector('#child')).toBeInstanceOf(HTMLElement)
    expect(element.innerHTML).toEqual(innerHTML)
  })
  it(`Creates an element with textContent`, () => {
    const textContent = `This is some text content`
    const element = createElement('div', { textContent })
    expect(element.textContent).toEqual(textContent)
  })
  it(`Creates an element with textContent including emojis`, () => {
    const textContent = `Text content with 🐳 🍔 ❤️`
    const element = createElement('div', { textContent })
    expect(element.textContent).toEqual(textContent)
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
