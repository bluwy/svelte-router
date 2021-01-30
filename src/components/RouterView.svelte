<script lang="ts">
  import { tick } from 'svelte'
  import { route, navigate } from '../global'
  import { handleThunk, handleComponentThunk, handlePromisable } from '../util'

  export let depth = 0

  $: match = $route.matched[depth]
  $: hasChildren = depth + 1 < $route.matched.length

  let canRender: boolean
  $: {
    canRender = false

    handlePromisable(handleThunk(match?.redirect), (result) => {
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

    handlePromisable(handleComponentThunk(match?.component), (result) => {
      component = typeof result === 'object' ? result.default : result
    })
  }
</script>

{#if canRender}
  {#if component != null}
    <svelte:component this={component}>
      {#if hasChildren}
        <svelte:self depth={depth + 1} />
      {/if}
    </svelte:component>
  {:else if hasChildren}
    <svelte:self depth={depth + 1} />
  {/if}
{/if}
