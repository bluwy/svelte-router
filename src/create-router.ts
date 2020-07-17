import { writable } from 'svelte/store'
import { matchRoute, routesToMatchers } from './matcher'
import { formatPath, readonly, removeLeading } from './util'

export interface Route {
  /** The route full concatenated path */
  path: string
  /**
   * Key-value pairs of route named parameters (denoted with ':') and wildcard
   * parameters (denoted with '*'). Access wildcard values with the 'wild' key.
   */
  params: Record<string, string>
  /** The path hash */
  hash: string
  /** Key-value pairs of query parameters (The '?' part of the URL) */
  query: Record<string, string>
  /** Array of all matched route records for this path */
  matched: RouteRecord[]
}

export interface RouteRecord {
  /** The route path, e.g. "/foo" */
  path: string
  /** Svelte component */
  component?: any
  /** Redirect to this path */
  redirect?: RedirectOption
  /** Attach custom metadata to this route */
  meta?: any
  /**
   * Array of children routes. If defined, this route component requires a
   * <Route /> component to render the child route.
   */
  children?: RouteRecord[]
}

export type RedirectOption = string | ((to: Route) => string)

export interface RouterOptions {
  /** The base path of your application */
  base: string
  routes: RouteRecord[]
}

export function createRouter(options: RouterOptions) {
  const basePath = formatPath(options.base)
  const matchers = routesToMatchers(options.routes)
  const route = writable({} as Route)

  window.addEventListener('pushstate', handleState)
  window.addEventListener('popstate', handleState)
  window.addEventListener('replacestate', handleState)

  function handleState() {
    const pathname = formatPath(location.pathname)
    const path = removeLeading(pathname, basePath)
    route.set(matchRoute(path, matchers))
  }

  function navigate(to: string, replace = false) {
    if (replace) {
      history.replaceState(to, null, to)
    } else {
      history.pushState(to, null, to)
    }
  }

  function destroy() {
    window.removeEventListener('pushstate', handleState)
    window.removeEventListener('popstate', handleState)
    window.removeEventListener('replacestate', handleState)
  }

  return {
    route: readonly(route),
    navigate,
    destroy
  }
}
