<script lang="ts">
  import { basePath } from './base-path'
  import { navigate } from './navigate'
  import { routerMode, route } from './router'
  import type { LocationInput } from './types'
  import {
    parseLocationInput,
    replaceLocationInputParams,
    joinPaths,
    formatPath
  } from './util'

  export let to: string | LocationInput
  export let replace = false

  $: input = typeof to === 'string' ? parseLocationInput(to) : to

  $: parsedInput = replaceLocationInputParams(input)

  // The input path only, no search and hash
  let path: string | undefined
  $: switch (routerMode) {
    case 'hash':
      path = parsedInput.path ?? parsedInput.hash?.slice(1)
      break
    case 'history':
      path = parsedInput.path
      break
  }

  $: formattedPath = path != null ? formatPath(path) : undefined

  let href: string
  $: {
    const searchString = parsedInput.search?.toString()
    const search = searchString ? '?' + searchString : ''

    switch (routerMode) {
      case 'hash':
        href = search + (path != null ? '#' + path : '')
        break
      case 'history':
        href = joinPaths(
          basePath,
          (path ?? '') + search + (parsedInput.hash ?? '')
        )
        break
    }
  }

  // Partial path match
  $: isActive = formattedPath && $route.path.startsWith(formattedPath)

  // Exact path match
  $: isActiveExact = $route.path === formattedPath
</script>

<a
  {...$$restProps}
  class:active={isActive}
  class:active-exact={isActiveExact}
  {href}
  aria-current={isActiveExact ? 'page' : undefined}
  on:click|preventDefault={() => navigate(to, replace)}
>
  <slot />
</a>
