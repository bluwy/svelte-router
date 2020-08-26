import { writable, Readable } from 'svelte/store'
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

export let routerMode: RouterMode | undefined

export let routerHistory: RouterHistory | undefined

const writableRoute = writable<Route>({
  path: '',
  params: {},
  matched: [],
  search: new URLSearchParams(),
  hash: ''
})

/** The current route information */
export const route: Readable<Route> = { subscribe: writableRoute.subscribe }

/** Initialize the global router. Call this before mounting the app. */
export function initRouter(options: RouterOptions) {
  // Use `routerMode` to check if router is already initialized
  if (routerMode == null) {
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

    routerHistory.currentLocation.subscribe(($currentLocation) => {
      const matchedRoute = matcher.matchRoute($currentLocation.path)

      writableRoute.set({
        ...$currentLocation,
        params: matchedRoute?.params ?? {},
        matched: matchedRoute?.matched ?? []
      })
    })
  }
}
