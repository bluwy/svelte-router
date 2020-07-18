import { writable } from 'svelte/store'
import { matchRoute, routesToMatchers } from './matcher'
import { formatPath, readonly, removeLeading } from './util'

export interface Route {
  /** The current path, e.g. "/foo/bar" */
  path: string
  /** The full path including hash and query */
  fullPath: string
  /**
   * Key-value pairs of route named parameters (denoted with ':') and wildcard
   * parameters (denoted with '*'). Access wildcard values with the 'wild' key.
   */
  params: Record<string, string>
  /** Key-value pairs of query parameters (The '?' part of the URL) */
  query: Record<string, string>
  /** The path hash */
  hash: string
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
  base?: string
  routes: RouteRecord[]
}

export type NavigateFn = (to: string, replace?: boolean) => void

export function createRouter(options: RouterOptions) {
  const basePath = formatPath(options.base ?? '/')
  const matchers = routesToMatchers(options.routes)
  const route = writable({} as Route)

  window.addEventListener('popstate', handleState)

  handleState()

  function handleState() {
    const path = formatPath(removeLeading(location.pathname, basePath))
    route.set(matchRoute(path, matchers))
  }

  const navigate: NavigateFn = (to: string, replace = false) => {
    if (replace) {
      history.replaceState(to, '', to)
    } else {
      history.pushState(to, '', to)
    }
    handleState()
  }

  function destroy() {
    window.removeEventListener('popstate', handleState)
  }

  return {
    route: readonly(route),
    navigate,
    destroy
  }
}
