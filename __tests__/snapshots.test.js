import SplitType from '../lib/SplitType'
import createElement from '../lib/utils/createElement'

describe('SplitType', () => {
  // Create two elements that will that will be used as targets
  const target1 = createElement('div', {
    textContent: 'Foo Bar',
    class: 'target',
    id: 'target1',
  })
  const target2 = createElement('div', {
    textContent: 'Hey There',
    class: 'target',
    id: 'target2',
  })

  document.body.appendChild(target1)
  document.body.appendChild(target2)

  test(`SplitType('#target1') matches snapshot`, () => {
    // Calls splitType on a single target element with the default settings
    const instance = new SplitType('#target1')
    expect(instance).toMatchSnapshot()
  })

  test(`SplitType('#target1', { split: 'lines' }) matches snapshot`, () => {
    // Calls `splitType` on a single target element, splitting text into only
    // lines.
    const instance = new SplitType('#target1', { split: 'lines' })
    expect(instance).toMatchSnapshot()
  })

  test(`SplitType('#target1', { split: 'words, chars' }) matches snapshot`, () => {
    // Calls `splitType` on a single target element, splitting text into words
    // and characters.
    const instance = new SplitType('#target1', { split: 'words, chars' })
    expect(instance).toMatchSnapshot()
  })

  test(`SplitType('.target') matches snapshot.`, () => {
    // This checks that `SplitType` returns the expected result given
    // two target elements and the defaults settings
    const instance = new SplitType('#target1', { split: 'words, chars' })
    expect(instance).toMatchSnapshot()
  })
})
