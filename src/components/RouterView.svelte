<script lang="ts">
  import { tick } from 'svelte'
  import type { RouteRecord } from '../types'
  import { route, navigate } from '../global'
  import { handleThunk, handlePromisable } from '../util'

  export let nextMatched: RouteRecord[] | undefined = undefined

  $: matched = nextMatched ?? $route.matched
  $: hasChildren = matched.length > 1
  $: component = matched[0]?.component

  let canRender: boolean
  $: {
    canRender = false

    handlePromisable(handleThunk(matched[0]?.redirect), (result) => {
      if (result != null) {
        tick().then(() => navigate(result, true))
      } else {
        canRender = true
      }
    })
  }
</script>

{#if canRender}
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
