// Polyfill the following DOM methods that are not supported in IE 11.
// This can be removed in the near future since we no longer support IE.
// - Element.append
// - Element.replaceWith
// - Element.replaceChildren
;(() => {
  function append(...nodes) {
    const length = nodes.length
    for (let i = 0; i < length; i++) {
      const node = nodes[i]
      if (node.nodeType === 1 || node.nodeType === 11) this.appendChild(node)
      else this.appendChild(document.createTextNode(String(node)))
    }
  }

  function replaceChildren(...nodes) {
    while (this.lastChild) {
      this.removeChild(this.lastChild)
    }
    if (nodes.length) this.append(...nodes)
  }

  function replaceWith(...nodes) {
    const parent = this.parentNode
    let i = nodes.length
    if (!parent) return
    if (!i) parent.removeChild(this)
    while (i--) {
      let node = nodes[i]
      if (typeof node !== 'object') {
        node = this.ownerDocument.createTextNode(node)
      } else if (node.parentNode) {
        node.parentNode.removeChild(node)
      }
      if (!i) {
        parent.replaceChild(node, this)
      } else {
        parent.insertBefore(this.previousSibling, node)
      }
    }
  }
  if (typeof Element !== 'undefined') {
    if (!Element.prototype.append) {
      Element.prototype.append = append
      DocumentFragment.prototype.append = append
    }
    if (!Element.prototype.replaceChildren) {
      Element.prototype.replaceChildren = replaceChildren
      DocumentFragment.prototype.replaceChildren = replaceChildren
    }
    if (!Element.prototype.replaceWith) {
      Element.prototype.replaceWith = replaceWith
      DocumentFragment.prototype.replaceWith = replaceWith
    }
  }
})()
