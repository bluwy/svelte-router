import { derived, Readable } from 'svelte/store'
import { RouterHistory, LocationData } from './history/base'
import { HashHistory } from './history/hash'
import { HtmlHistory } from './history/html'
import { RouteMatcher, MatchedRoute } from './matcher'
import { RouteRecord, RouterMode } from './types'

export type Route = MatchedRoute & LocationData

export interface RouterOptions {
  /** The routing mode: "hash" or "history". Default: "hash" */
  mode?: RouterMode
  routes?: RouteRecord[]
}

let inited = false

export let routerMode: RouterMode

export let routerHistory: RouterHistory

export let route: Readable<Route>

export function initRouter(options: RouterOptions) {
  if (!inited) {
    inited = true

    routerMode = options.mode ?? 'hash'

    switch (routerMode) {
      case 'hash':
        routerHistory = new HashHistory()
        break
      case 'history':
        routerHistory = new HtmlHistory()
        break
    }

    const matcher = new RouteMatcher(options.routes)

    route = derived(routerHistory.currentLocation, ($currentLocation) => {
      const matchedRoute = matcher.matchRoute($currentLocation.path)

      return {
        ...$currentLocation,
        params: matchedRoute?.params ?? {},
        matched: matchedRoute?.matched ?? []
      }
    })
  }
}
