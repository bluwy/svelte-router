<script lang="ts">
  import { tick } from 'svelte'
  import type { RouteRecord } from '../types'
  import { route, navigate } from '../global'
  import { handleThunk, handleComponentThunk, handlePromisable } from '../util'

  export let nextMatched: RouteRecord[] | undefined = undefined

  $: matched = nextMatched ?? $route.matched
  $: hasChildren = matched.length > 1

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

  let component: Function | undefined
  $: {
    component = undefined

    handlePromisable(handleComponentThunk(matched[0]?.component), (result) => {
      component = typeof result === 'object' ? result.default : result
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
