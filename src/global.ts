import { writable } from 'svelte/store'
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

export const route = writable<Route>({
  path: '',
  params: {},
  matched: [],
  search: new URLSearchParams(),
  hash: ''
})

export function initRouter(options: RouterOptions) {
  let router: Router

  switch (options.mode) {
    case 'hash':
      router = new HashRouter(options.routes)
    case 'path':
      router = new PathRouter(options.routes)
  }

  navigate = router.navigate

  createLink = router.createLink

  router.currentRoute.subscribe((v) => route.set(v))
}
