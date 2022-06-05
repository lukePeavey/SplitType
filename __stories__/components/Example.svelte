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

  // element ref
  let container

  // SplitType instance
  let instance

  // A resize observer that will be triggered after the container element is
  // resized. This is used to reposition text when using absolute postion.
  const resizeObserver = new ResizeObserver(
    debounce(() => {
      // When absolute position is enabled, split text does not automatically
      // reflow when the container element is resized. We need to reposition
      // the split text manually by calling the `split` method after the
      // container element has been resized. This is equivalent to re-splitting
      // the text using the same options.
      if (options.position === 'absolute' && instance != null) {
        instance.split()
      }
    }, 500)
  )

  // Support "types=none" as an alias for types=""
  if (options.types === 'none') options.types = ''

  onMount(() => {
    // Split the the target element(s) using the provided options
    instance = SplitType.create('.target', options)
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
    <div class="target">{@html childContent}</div>
  {/each}
</div>
