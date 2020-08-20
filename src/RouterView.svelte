<script lang="ts">
  import { route } from './router'
  import type { RouteRecord } from './types'

  export let nextMatched: RouteRecord[] | undefined = undefined

  $: matched = nextMatched ?? $route.matched
</script>

<svelte:component this={matched[0]?.component}>
  {#if matched.length > 1}
    <svelte:self nextMatched={matched.slice(1)} />
  {/if}
</svelte:component>
