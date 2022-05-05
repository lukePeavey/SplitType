import SplitType from '../../lib'

export default function getTemplate(defaultArgs = {}) {
  return (args) => {
    const { children, className, ...options } = { ...defaultArgs, ...args }
    const element = document.createElement('div')
    element.className = `target ${className || ''}`.trim()
    element.innerHTML = children
    window.setTimeout(() => SplitType.create(element, options), 1)
    return element
  }
}
