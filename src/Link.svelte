<script lang="ts">
  import type { LocationInput } from './types'
  import { createLink, navigate } from './global'

  /** @type {string | import('./types').LocationInput} */
  export let to: string | LocationInput
  export let replace = false

  $: link = createLink(to)

  function handleClick(e: MouseEvent) {
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      e.shiftKey ||
      e.button ||
      e.defaultPrevented
    ) {
      return
    }

    e.preventDefault()
    navigate(to, replace)
  }
</script>

<a
  {...$$restProps}
  class:link-active={$link.isActive}
  class:link-exact-active={$link.isExactActive}
  href={$link.href}
  aria-current={$link.isExactActive ? 'page' : undefined}
  on:click={handleClick}
>
  <slot />
</a>
