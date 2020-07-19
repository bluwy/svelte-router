<script lang="ts">
  import { getContext, setContext } from 'svelte'
  import type { Router } from './create-router'
  import { DEPTH, ROUTER } from './context'
  import { RouterError } from './error'

  // Only for root router
  export let router: Router | undefined = undefined

  // The readonly route store, mainly used to access matched route records
  let routerStore: Router = getContext(ROUTER)

  // The depth that will be incremented when traversing nested routes
  let depth = getContext(DEPTH)

  let currentDepth = 0

  const isRoot = routerStore == null && depth == null

  // Initialize context
  if (isRoot) {
    if (router == null) {
      throw new RouterError('The root RouterView requires the "router" prop.')
    }

    routerStore = router
    setContext(ROUTER, routerStore)

    depth = {}
    setContext(DEPTH, depth)
  }

  // Whenever the route changes, re-evaluate route depth
  $: if ($routerStore) {
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
  $: component = $routerStore.matched[currentDepth]?.component
</script>

<svelte:component this={component} />
