import { writable, Writable } from 'svelte/store'
import { RouterMode, createHistory } from './history'
import { matchRoute, routesToMatchers, RouteMatcher } from './matcher'
import { formatPath, removeLeading } from './util'
import type { History, State } from 'history'

export interface Route {
  /** The current path, e.g. "/foo/bar" */
  path: string
  /** The full path including hash and query */
  fullPath: string
  /**
   * Key-value pairs of route named parameters (denoted with ":") and wildcard
   * parameters (denoted with "*"). Access wildcard values with the 'wild' key.
   */
  params: Record<string, string>
  /** Key-value pairs of query parameters (The "?" part of the URL) */
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
  routes?: RouteRecord[]
}

export class Router {
  readonly subscribe: Writable<Route>['subscribe']

  private readonly basePath: string
  private readonly hist: History<State>
  private readonly matchers: RouteMatcher[]
  private readonly route: Writable<Route>

  private histListener: Function | undefined

  constructor(options?: RouterOptions) {
    this.basePath = formatPath(options?.base ?? '')
    this.hist = createHistory(options?.mode ?? 'hash')
    this.matchers = routesToMatchers(options?.routes)
    this.route = writable({} as Route)
    this.subscribe = this.route.subscribe

    this.listen()
  }

  /**
   * Starts listening for path changes. This will be automatically called on
   * router initialization. Call `unlisten` to stop the router.
   */
  listen() {
    if (this.histListener == null) {
      this.histListener = this.hist.listen(this.handlePathChange)
      this.handlePathChange()
    }
  }

  /**
   * Stops listening for path changes. You generally won't have to call this
   * since the router is attached per app instance. Call `listen` to re-start
   * the router.
   */
  unlisten() {
    if (this.histListener != null) {
      this.histListener()
    }
  }

  /**
   * Pushes a new location onto the history stack, increasing its length by one.
   * If there were any entries in the stack after the current one, they are lost.
   */
  push(to: string) {
    this.hist.push(to)
  }

  /**
   * Replaces the current location in the history stack with a new one. The
   * location that was replaced will no longer be available.
   */
  replace(to: string) {
    this.hist.replace(to)
  }

  /**
   * Navigates n entries backward/forward in the history stack relative to the
   * current index. For example, a "back" navigation would use go(-1).
   */
  go(delta: number) {
    this.hist.go(delta)
  }

  /** Navigates to the next entry in the stack. Identical to go(1). */
  forward() {
    this.hist.forward()
  }

  /** Navigates to the previous entry in the stack. Identical to go(-1). */
  back() {
    this.hist.back()
  }

  /**
   * Use this action on an anchor tag to automatically handle router navigation.
   * Can also be used on any element so its nested anchor tags will be handled
   * as well.
   *
   * Only href that starts with "/" will be routed. This behavior can be skipped
   * by adding a `noroute` attribute on the anchor tag.
   *
   * The navigation will use `push` by default. Add a `replace` attribute on the
   * anchor tag to use `replace`.
   */
  link(node: HTMLElement) {
    const handleClick = (e: MouseEvent) => {
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.shiftKey ||
        e.button ||
        e.defaultPrevented
      ) {
        return
      }

      const a = (e.target as Element).closest('a')

      if (a != null) {
        const href = a.href

        if (href.startsWith('/') && !a.getAttribute('noroute')) {
          e.preventDefault()

          if (a.getAttribute('replace')) {
            this.replace(href)
          } else {
            this.push(href)
          }
        }
      }
    }

    node.addEventListener('click', handleClick)

    return {
      destroy() {
        node.removeEventListener('click', handleClick)
      }
    }
  }

  private handlePathChange() {
    const path = formatPath(
      removeLeading(this.hist.location.pathname, this.basePath)
    )
    const matched = matchRoute(path, this.matchers)

    // Redirects happen when the result full path is not the same as passed
    if (path !== matched.fullPath) {
      // TODO: Optimize instead of replace and re-triggering handlePathChange
      this.hist.replace(matched.fullPath)
    } else {
      this.route.set(matched)
    }
  }
}
