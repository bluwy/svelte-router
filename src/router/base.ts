import { Readable, readable, derived } from 'svelte/store'
import { MatchedRoute, RouteMatcher } from '../matcher'
import { LocationInput, RouteRecord } from '../types'
import { LOCATION_CHANGE } from '../location-change-shim'
import { parseLocationInput, formatPath } from '../util'

export interface Route extends MatchedRoute {
  search: URLSearchParams
  hash: string
}

export interface LinkState {
  href: string
  isActive: boolean
  isExactActive: boolean
}

export abstract class Router {
  readonly currentRoute: Readable<Route>
  private readonly routeMatcher: RouteMatcher

  constructor(routes: RouteRecord[]) {
    this.routeMatcher = new RouteMatcher(routes)

    this.currentRoute = readable(this.getCurrentRoute(), (set) => {
      const handleChange = () => set(this.getCurrentRoute())

      window.addEventListener(LOCATION_CHANGE, handleChange)

      return () => window.removeEventListener(LOCATION_CHANGE, handleChange)
    })

    // Format URL on page load
    this.navigate(this.getCurrentLocationInput(), true)
  }

  /**
   * Navigates to the url but do not create a new entry in the history
   */
  protected abstract replace(url: string): void
  /**
   * Navigates to the url, leaving behind a trace in the history
   */
  protected abstract push(url: string): void
  protected abstract getCurrentPath(): string
  protected abstract getCurrentLocationInput(): LocationInput
  protected abstract getPath(to: LocationInput): string | undefined
  protected abstract createUrl(to: LocationInput): string
  protected abstract createLinkHref(to: LocationInput): string
  protected abstract replaceParams(
    to: LocationInput,
    params?: Record<string, string>
  ): LocationInput

  /**
   * Navigate using an offset in the current history. Works the same way as
   * [`history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History/go).
   */
  navigate(to: number): void
  /**
   * Navigate to a route using a path string or a location descriptor object
   */
  navigate(to: string | LocationInput, replace?: boolean): void
  navigate(to: number | string | LocationInput, replace = false) {
    if (typeof to === 'number') {
      history.go(to)
      return
    }

    if (typeof to === 'string') {
      to = parseLocationInput(to)
    }

    const url = this.createUrl(this.replaceParams(to))

    if (replace) {
      this.replace(url)
    } else {
      this.push(url)
    }
  }

  /** Returns a readable store that contains the given link's information */
  createLink(to: string | LocationInput): Readable<LinkState> {
    const input = typeof to === 'string' ? parseLocationInput(to) : to

    return derived(this.currentRoute, ($currentRoute) => {
      const replacedInput = this.replaceParams(input, $currentRoute.params)
      const href = this.createLinkHref(replacedInput)
      const path = this.getPath(replacedInput)

      if (path == null) {
        return {
          href,
          isActive: false,
          isExactActive: false
        }
      }

      const formattedPath = formatPath(path)
      const routePath = $currentRoute.path

      return {
        href,
        isActive: routePath.startsWith(formattedPath),
        isExactActive: routePath === formattedPath
      }
    })
  }

  private getCurrentRoute(): Route {
    const currentPath = this.getCurrentPath()
    const matchedRoute = this.routeMatcher.matchRoute(currentPath)

    return {
      path: currentPath,
      search: new URLSearchParams(window.location.search),
      hash: window.location.hash,
      params: matchedRoute?.params ?? {},
      matched: matchedRoute?.matched ?? []
    }
  }
}
