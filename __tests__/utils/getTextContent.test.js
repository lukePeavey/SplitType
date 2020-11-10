import getTextContent from '../../lib/utils/getTextContent'

describe(`utils.getTextContent(element)`, () => {
  const textContent = 'Hello Word.'
  it(`Returns the textContent of element`, () => {
    const element = document.createElement('div')
    element.textContent = textContent
    expect(getTextContent(element)).toEqual(textContent)
  })

  it(`Returns the text content of an element that contains nested HTML`, () => {
    const element = document.createElement('div')
    element.innerHTML = `<div>Hello</div> <span>Word</span>.`
    expect(getTextContent(element)).toEqual(textContent)
  })
})
