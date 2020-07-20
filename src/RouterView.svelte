<script lang="ts">
  import { getContext, setContext } from 'svelte'
  import { DEPTH } from './context'
  import { RouterError } from './error'
  import { route } from './router'

  // The depth that will be incremented when traversing nested routes
  let depth: { value: number } = getContext(DEPTH)

  let currentDepth = 0

  const isRoot = depth == null

  // Initialize context
  if (isRoot) {
    depth = { value: 0 }
    setContext(DEPTH, depth)
  }

  // Whenever the route changes, re-evaluate route depth
  $: if ($route) {
    if (isRoot) {
      // Reset depth
      depth.value = 0
      currentDepth = 0
    } else {
      // Subsequent component will get new depth sequentially
      depth.value += 1
      currentDepth = depth.value
    }
  }

  // Get current matched component for this depth
  let component: any
  $: component = $route.matched[currentDepth]?.component
</script>

{#if component != null}
  <svelte:component this={component} />
{:else if currentDepth + 1 < $route.matched.length}
  <svelte:self />
{/if}
