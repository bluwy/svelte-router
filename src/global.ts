import { writable, Readable } from 'svelte/store'
import { Router, Route } from './router/base'
import { HashRouter } from './router/hash-router'
import { PathRouter } from './router/path-router'
import { RouteRecord } from './types'

let globalRouter: Router | undefined

const writableRoute = writable<Route>({
  path: '',
  params: {},
  matched: [],
  search: new URLSearchParams(),
  hash: ''
})

export const route: Readable<Route> = { subscribe: writableRoute.subscribe }

export const navigate: Router['navigate'] = function () {
  if (globalRouter != null) {
    // @ts-expect-error
    return globalRouter.navigate(...arguments)
  } else {
    throw new Error('Router must be initialized before calling navigate')
  }
}

export const createLink: Router['createLink'] = function () {
  if (globalRouter != null) {
    // @ts-expect-error
    return globalRouter.createLink(...arguments)
  } else {
    throw new Error('Router must be initialized before calling createLink')
  }
}

export function initHashRouter(routes: RouteRecord[]) {
  initRouter(new HashRouter(routes))
}

export function initPathRouter(routes: RouteRecord[]) {
  initRouter(new PathRouter(routes))
}

function initRouter(router: Router) {
  if (globalRouter == null) {
    globalRouter = router
    globalRouter.currentRoute.subscribe((v) => writableRoute.set(v))
  } else {
    throw new Error('Router already initialized. Cannot re-initialize router.')
  }
}
