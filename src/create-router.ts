import { writable } from 'svelte/store'
import { matchRoute, routesToMatchers } from './matcher'
import { formatPath, readonly, removeLeading, joinPaths } from './util'

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

export function createRouter(options: RouterOptions) {
  const basePath = formatPath(options.base ?? '/')
  const matchers = routesToMatchers(options.routes)
  const route = writable({} as Route)

  window.addEventListener('popstate', initRoute)

  function initRoute() {
    const currentPath = formatPath(removeLeading(location.pathname, basePath))
    const matched = matchRoute(currentPath, matchers)

    // Check if needs to be redirected
    if (typeof matched === 'string') {
      // NOTE: This may cause infinite redirects, but I don't think it's our job
      // to prevent it
      navigate(matched, true)
      return
    }

    route.set(matched)
  }

  function navigate(to: string, replace = false) {
    const matched = matchRoute(to, matchers)

    // Check if needs to be redirected
    if (typeof matched === 'string') {
      // NOTE: This may cause infinite redirects, but I don't think it's our job
      // to prevent it
      navigate(matched, true)
      return
    }

    route.set(matched)

    const finalPath = joinPaths(basePath, to)

    // TODO: Use generalized history function/class to support hash-based routing
    if (replace) {
      history.replaceState(finalPath, '', finalPath)
    } else {
      history.pushState(finalPath, '', finalPath)
    }
  }

  function destroy() {
    window.removeEventListener('popstate', initRoute)
  }

  return {
    route: readonly(route),
    navigate,
    destroy
  }
}
