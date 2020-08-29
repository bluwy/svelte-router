import { writable, Readable } from 'svelte/store'
import { Router, Route } from './router/base'
import { HashRouter } from './router/hash-router'
import { PathRouter } from './router/path-router'
import { RouteRecord } from './types'

export interface RouterOptions {
  mode: 'hash' | 'path'
  routes: RouteRecord[]
}

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

export function initRouter(options: RouterOptions) {
  if (inited) {
    throw new Error(
      'Router is already initialized. Cannot re-initialize router.'
    )
  }

  let router: Router

  switch (options.mode) {
    case 'hash':
      router = new HashRouter(options.routes)
      break
    case 'path':
      router = new PathRouter(options.routes)
      break
  }

  navigate = router.navigate.bind(router)

  createLink = router.createLink.bind(router)

  router.currentRoute.subscribe((v) => writableRoute.set(v))

  inited = true
}
