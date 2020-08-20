<script lang="ts">
  import type { RouteRecord } from './types'
  import { route } from './router'
  import { navigate } from './navigate'
  import { handlePromisable } from './util'

  export let nextMatched: RouteRecord[] | undefined = undefined

  $: matched = nextMatched ?? $route.matched
  $: redirect = matched[0]?.redirect

  let canRender = false
  $: if (redirect != null) {
    canRender = false

    handlePromisable(
      typeof redirect === 'function' ? redirect() : redirect,
      (result) => {
        if (result != null) {
          navigate(result, true)
        } else {
          canRender = true
        }
      }
    )
  }
</script>

{#if !redirect || canRender}
  <svelte:component this={matched[0]?.component}>
    {#if matched.length > 1}
      <svelte:self nextMatched={matched.slice(1)} />
    {/if}
  </svelte:component>
{/if}
