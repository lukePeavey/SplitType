<script>
  import { onMount, onDestroy } from 'svelte'
  import SplitType from '../../lib/SplitType'
  import debounce from 'lodash/debounce'
  import ResizeObserver from './ResizeObserver'

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

  // element ref
  let target

  let container

  // Will be set to true after the until view has been rendered
  // Used to avoid repositioning text when resize observer is triggered
  // after the initial page load.
  let isInitialRenderComplete = false
  let lastContentBox = null

  // SplitType instance
  let instance

  // Event handler that will be called when the target element is resized.
  // When absolute position is enabled, we will reposition text after the
  // element is resized.
  function handleResize([entry]) {
    let { contentBoxSize: contentBox } = entry
    if (Array.isArray(contentBox)) {
      contentBox = contentBox[0]
    }
    if (lastContentBox) {
      if (options.absolute || /lines/.test(String(options.types))) {
        const previousWidth = Math.floor(lastContentBox.inlineSize)
        const newWidth = Math.floor(contentBox.inlineSize)
        if (previousWidth !== newWidth) {
          instance.split()
        }
      }
    }
    lastContentBox = contentBox
  }

  const resizeObserver = new ResizeObserver(debounce(handleResize, 350))

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
