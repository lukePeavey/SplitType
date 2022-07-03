<script>
  import { onMount, onDestroy } from 'svelte'
  import SplitType from '../../lib/SplitType'
  import debounce from 'lodash/debounce'

  // The html content of the target element(s). This can be single `string` or
  // an `Array` of strings. If it's an array, we will render
  // multiple target elements.
  export let children
  // className for the cotainer element
  export let className = ''
  // SplitType options
  export let options = {}

  // Coerce children to an array
  const childrenArray = Array.isArray(children) ? children : [children]
  // Reference to the container element
  let containerElement
  // Resizer observer
  let resizeObserver = { observe: () => {}, disconnect: () => {} }
  // Stores teh width of the container element
  let previousContainerWidth = null
  // SplitType instance
  let instance

  // Event handler that will be called when the target element is resized.
  // When absolute position is enabled, we will reposition text after the
  // element is resized.
  function handleResize(entry) {
    let width
    // Only proceed if we are splitting text into lines or using absolute pos
    if (options.absolute || /lines/.test(String(options.types))) {
      const [{ contentRect }] = entry
      width = Math.floor(contentRect.width)
      // Only proceed if 1) `previousContainerWidth` has been set (this avoids
      // calling the split method when the resize observer is triggered on the
      // initial render) and 2) if the width of the container element has
      // changed.
      if (previousContainerWidth && previousContainerWidth !== width) {
        instance.split()
      }
    }
    // Store the width of the `contentRect`
    previousContainerWidth = width
  }

  // If supported, create a resize observer for the container element
  if (window.ResizeObserver !== undefined) {
    resizeObserver = new ResizeObserver(debounce(handleResize, 100))
  }

  // Support "types=none" as an alias for types=""
  if (options.types === 'none') options.types = ''

  onMount(() => {
    // Split the the target element(s) using the provided options
    instance = SplitType.create('.target', options)
    resizeObserver.observe(containerElement)
  })

  onDestroy(() => {
    // Cleanup splitType instance
    instance.revert()
    resizeObserver.disconnect()
  })
</script>

<div bind:this={containerElement} class={`container ${className || ''}`}>
  {#each childrenArray as childContent}
    <div class="target">{@html childContent}</div>
  {/each}
</div>
