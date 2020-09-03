import { writable, Readable } from 'svelte/store'
import { Router, Route } from './router/base'
import { HashRouter } from './router/hash-router'
import { PathRouter } from './router/path-router'
import { RouteRecord } from './types'

// Will be assigned when `initRouter`
export let navigate: Router['navigate'] = () => {
  throw new Error('Router must be initialized before calling navigate')
}

// Will be assigned when `initRouter`
export let createLink: Router['createLink'] = () => {
  throw new Error('Router must be initialized before calling createLink')
}

const writableRoute = writable<Route>({
  path: '',
  params: {},
  matched: [],
  search: new URLSearchParams(),
  hash: ''
})

export const route: Readable<Route> = { subscribe: writableRoute.subscribe }

let inited = false

function initRouter(router: Router) {
  navigate = router.navigate.bind(router)
  createLink = router.createLink.bind(router)
  router.currentRoute.subscribe((v) => writableRoute.set(v))
}

function checkInit() {
  if (inited) {
    throw new Error('Router already initialized. Cannot re-initialize router.')
  } else {
    inited = true
  }
}

export function initHashRouter(routes: RouteRecord[]) {
  checkInit()
  initRouter(new HashRouter(routes))
}

export function initPathRouter(routes: RouteRecord[]) {
  checkInit()
  initRouter(new PathRouter(routes))
}
