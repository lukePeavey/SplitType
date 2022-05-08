import getTextContent from '../../lib/utils/getTextContent'

describe(`utils.getTextContent(element)`, () => {
  const textContent = 'Hello World.'
  it(`Returns the value of a text node`, () => {
    const node = document.createTextNode(textContent)
    expect(getTextContent(node)).toEqual(textContent)
  })

  it(`Removes extra white space`, () => {
    const node = document.createTextNode('  Hello   World.\n ')
    expect(getTextContent(node)).toEqual(textContent)
  })
})
