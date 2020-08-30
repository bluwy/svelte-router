<script lang="ts">
  import type { LocationInput } from './types'
  import { createLink, navigate } from './global'

  /** @type {string | import('./types').LocationInput} */
  export let to: string | LocationInput
  export let replace = false

  $: link = createLink(to)
</script>

<a
  {...$$restProps}
  class:link-active={$link.isActive}
  class:link-exact-active={$link.isExactActive}
  href={$link.href}
  aria-current={$link.isExactActive ? 'page' : undefined}
  on:click|preventDefault={() => navigate(to, replace)}
>
  <slot />
</a>
