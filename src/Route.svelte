<script>
  import { getContext, setContext } from 'svelte'
  import { DEPTH, NAVIGATE, ROUTE } from './context'
  import { RouterError } from './error'
  
  // Only for root router
  export let router = undefined

  // The readonly route store, mainly used to access matched route records
  let routeStore = getContext(ROUTE)

  // The current rendered component, will be incremented when traversing nested routes
  let depth = getContext(DEPTH)

  const isRoot = routeStore == null && depth == null
  
  // Initialize routeStore context
  if (isRoot) {
    if (router == null) {
      throw new RouterError('The root route requires the router prop.')
    }

    routeStore = router.route

    // Set context to be used by descendants
    setContext(ROUTE, router.route)
    setContext(NAVIGATE, router.navigate)
  }
  
  // Whenever the route changes, re-evaluate route depth
  $: if ($routeStore) {
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
  $: component = $routeStore.matched[depth].component
</script>

<svelte:component this={component} />
