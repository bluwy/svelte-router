<script>
  import { getContext, setContext } from 'svelte'
  import { DEPTH, ROUTER } from './context'
  import { RouterError } from './error'

  // Only for root router
  export let router = undefined

  // The readonly route store, mainly used to access matched route records
  let routerStore = getContext(ROUTER)

  // The current rendered component, will be incremented when traversing nested routes
  let depth = getContext(DEPTH)

  const isRoot = routerStore == null && depth == null

  // Initialize routeStore context
  if (isRoot) {
    if (router == null) {
      throw new RouterError('The root route requires the router prop.')
    }

    routerStore = router

    // Set context to be used by descendants
    setContext(ROUTE, router)
  }

  // Whenever the route changes, re-evaluate route depth
  $: if ($routerStore) {
    if (isRoot) {
      // Reset depth
      depth = 0
      setContext(DEPTH, 0)
    } else {
      // Subsequent component will get new depth sequentially
      depth = getContext(DEPTH) + 1
      setContext(DEPTH, depth)
    }
  }

  // Get current matched component for this depth
  $: component = $routerStore.matched[depth]?.component
</script>

<svelte:component this={component} />
