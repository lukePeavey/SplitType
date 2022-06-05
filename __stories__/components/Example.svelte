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
  // Reference to target element
  let target
  // Reference to the container element
  let container
  // Resizer observer (we set this to a mock observer avoid errors in IE)
  let resizeObserver = { observe: () => {}, disconnect: () => {} }
  // Stores the last `contentBoxSize` from the resizeObserver. We use this to
  // check if the width of the content box has changed since the last time
  // the resize observer was triggered.
  let previousContentWidth = null
  // SplitType instance
  let instance

  // Event handler that will be called when the target element is resized.
  // When absolute position is enabled, we will reposition text after the
  // element is resized.
  function handleResize(entry) {
    let width
    // The resize observer is only necessary when absolute position is enabled,
    // or we splitting text into lines
    if (options.absolute || /lines/.test(String(options.types))) {
      // The new content box of the container element
      const [{ contentRect }] = entry
      width = Math.floor(contentRect.width)
      // Only proceed if `previousContentWidth` has been set. This prevents the
      // split method from being called again when the resizeObserver is
      // triggered on the initial render.
      if (previousContentWidth && previousContentWidth !== width) {
        instance.split()
        console.log('re-split')
      }
    }
    // Store the width of the `contentRect`
    previousContentWidth = width
  }

  // If supported, create a resize observer for the container element
  if (window.ResizeObserver !== undefined) {
    resizeObserver = new ResizeObserver(debounce(handleResize, 350))
  }

  // Support "types=none" as an alias for types=""
  if (options.types === 'none') options.types = ''

  onMount(() => {
    // Split the the target element(s) using the provided options
    instance = SplitType.create(target, options)
    console.log(instance)

    // Observe size of container element for changes
    resizeObserver.observe(container)
  })

  onDestroy(() => {
    resizeObserver.disconnect()
  })
</script>

<div bind:this={container} class={`container ${className || ''}`}>
  {#each childrenArray as childContent}
    <div bind:this={target} class="target">{@html childContent}</div>
  {/each}
</div>
