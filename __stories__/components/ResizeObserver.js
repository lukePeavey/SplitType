function ResizeObserverPolyfill() {
  this.observe = () => {}
  this.destroy = () => {}
}

const SafeResizeObserver = ResizeObserver || ResizeObserverPolyfill
export default SafeResizeObserver
