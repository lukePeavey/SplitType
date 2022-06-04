<script>
  import { onMount } from 'svelte'
  import SplitType from '../../lib/SplitType'

  // The text or html content of the target element(s). This can be single
  // `string` or an `Array` of strings. If it's an array, we will render
  // multiple target elements.
  export let children
  // className for the cotainer element
  export let className = ''
  // SplitType options
  export let options = {}

  // Support "types=none" as an alias for types="", which will result in
  // text not being split
  if (options.types === 'none') {
    options.types = ''
  }

  // Array of content for each target element
  const contents = Array.isArray(children) ? children : [children]

  onMount(() => {
    window.scrollTo(0, document.body.scrollHeight)
    // Split the text of the target element(s) using the provided options
    const split = SplitType.create('.target', options)
    // Lot the splitType instance to console for debugging
    console.log(split)
  })
</script>

<div class={`container ${className || ''}`}>
  {#each contents as content}
    <div class="target">{@html content}</div>
  {/each}
</div>

<style>
</style>
