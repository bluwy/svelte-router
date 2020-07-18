import { writable } from 'svelte/store'
import { RouterMode, createHistory } from './history'
import { matchRoute, routesToMatchers } from './matcher'
import { formatPath, removeLeading } from './util'

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
  /** The routing mode: "hash" or "history". Default: "hash" */
  mode?: RouterMode
  routes: RouteRecord[]
}

export type Router = ReturnType<typeof createRouter>

export function createRouter(options: RouterOptions) {
  const basePath = formatPath(options.base ?? '')
  const hist = createHistory(options.mode ?? 'hash')
  const matchers = routesToMatchers(options.routes)
  const route = writable({} as Route)
  let histListener: Function | undefined

  listen()

  /** Starts listening for path changes. This will  */
  function listen() {
    if (histListener == null) {
      histListener = hist.listen(handlePathChange)
      handlePathChange()
    }
  }

  function unlisten() {
    if (histListener != null) {
      histListener()
    }
  }

  function handlePathChange() {
    const path = formatPath(removeLeading(location.pathname, basePath))
    const matched = matchRoute(path, matchers)

    // Check if needs to be redirected
    // NOTE: This may cause infinite redirects, but I don't think it's our job
    // to prevent it
    if (typeof matched === 'string') {
      hist.replace(matched)
    } else {
      route.set(matched)
    }
  }

  return {
    subscribe: route.subscribe,
    push: hist.push,
    replace: hist.replace,
    go: hist.go,
    forward: hist.forward,
    back: hist.back,
    listen,
    unlisten
  }
}
