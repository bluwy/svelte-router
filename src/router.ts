import type { Route, RouterOptions } from './types'
import { writable, Readable } from 'svelte/store'
import { createHistory } from './history'
import { routesToMatchers, matchRoute } from './matcher'
import { formatPath, removeLeading, joinPaths } from './util'

let _route = writable({} as Route)

/** The current active route data */
export const route: Readable<Route> = { subscribe: _route.subscribe }

/** The app router, contains navigation functions */
export let router: ReturnType<typeof createRouter>

/**
 * Initializes the app router. You must call this before using the `route` or
 * `router` variables.
 */
export function initRouter(options?: RouterOptions) {
  if (router == null) {
    router = createRouter(options)
  }
}

function createRouter(options?: RouterOptions) {
  const basePath = formatPath(options?.base ?? '')
  const hist = createHistory(options?.mode ?? 'hash')
  const matchers = routesToMatchers(options?.routes)

  hist.listen(handlePathChange)
  handlePathChange()

  function handlePathChange() {
    const path = formatPath(removeLeading(hist.location.pathname, basePath))
    const matched = matchRoute(path, matchers)

    // Redirects happen when the result full path is not the same as passed
    if (path !== matched.fullPath) {
      // TODO: Optimize instead of replace and re-triggering handlePathChange
      hist.replace(matched.fullPath)
    } else {
      _route.set(matched)
    }
  }

  return {
    /**
     * Pushes a new location onto the history stack, increasing its length by one.
     * If there were any entries in the stack after the current one, they are lost.
     */
    push(to: string) {
      hist.push(joinPaths(basePath, to))
    },
    /**
     * Replaces the current location in the history stack with a new one. The
     * location that was replaced will no longer be available.
     */
    replace(to: string) {
      hist.replace(joinPaths(basePath, to))
    },
    /**
     * Navigates n entries backward/forward in the history stack relative to the
     * current index. For example, a "back" navigation would use go(-1).
     */
    go(delta: number) {
      hist.go(delta)
    },
    /** Navigates to the next entry in the stack. Identical to go(1). */
    forward() {
      hist.forward()
    },
    /** Navigates to the previous entry in the stack. Identical to go(-1). */
    back() {
      hist.back()
    }
  }
}
