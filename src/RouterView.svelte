<script lang="ts">
  import type { RouteRecord } from './types'
  import { route } from './router'
  import { navigate } from './navigate'
  import { handleThunk, handlePromisable } from './util'

  export let nextMatched: RouteRecord[] | undefined = undefined

  $: matched = nextMatched ?? $route.matched
  $: hasChildren = matched.length > 1
  $: component = matched[0]?.component
  $: redirect = matched[0]?.redirect

  let canRender = false
  $: if (redirect != null) {
    canRender = false

    handlePromisable(handleThunk(redirect), (result) => {
      if (result != null) {
        navigate(result, true)
      } else {
        canRender = true
      }
    })
  }
</script>

{#if !redirect || canRender}
  {#if component != null}
    {#if hasChildren}
      <svelte:component this={component}>
        <svelte:self nextMatched={matched.slice(1)} />
      </svelte:component>
    {:else}
      <svelte:component this={component} />
    {/if}
  {:else if hasChildren}
    <svelte:self nextMatched={matched.slice(1)} />
  {/if}
{/if}
