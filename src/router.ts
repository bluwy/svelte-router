import { derived, Readable } from 'svelte/store'
import { RouterHistory, LocationData } from './history/base'
import { HtmlHistory } from './history/html'
import { HashHistory } from './history/hash'
import { RouteMatcher, MatchedRoute } from './matcher'
import { RouteRecord } from './types'

export type Route = MatchedRoute & LocationData

export interface RouterOptions {
  /** The routing mode: "hash" or "history". Default: "hash" */
  mode?: 'hash' | 'history'
  routes?: RouteRecord[]
}

let inited = false

export let routerHistory: RouterHistory

export let route: Readable<Route>

export function initRouter(options: RouterOptions) {
  if (!inited) {
    inited = true

    switch (options.mode) {
      case 'history':
        routerHistory = new HtmlHistory()
        break
      default:
        routerHistory = new HashHistory()
        break
    }

    const matcher = new RouteMatcher(options.routes)

    route = derived(routerHistory.currentLocation, ($currentLocation) => {
      const matchedRoute = matcher.matchRoute($currentLocation.path)

      console.log($currentLocation, matchedRoute)
      
      return {
        ...$currentLocation,
        params: matchedRoute?.params ?? {},
        matched: matchedRoute?.matched ?? []
      }
    })
  }
}
