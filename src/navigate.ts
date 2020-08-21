import { LocationInput } from './types'
import { route, routerMode, routerHistory } from './router'

let routeParams: Record<string, string> = {}
route.subscribe(($route) => {
  routeParams = $route.params
})

export function navigate(to: number): void
export function navigate(to: string | LocationInput, replace?: boolean): void
export function navigate(to: number | string | LocationInput, replace = false) {
  if (typeof to === 'number') {
    routerHistory.go(to)
    return
  }

  if (typeof to === 'string') {
    const url = new URL(to, 'https://example.com')

    const hasPath = to.length > 0 && !to.startsWith('?') && !to.startsWith('#')

    const path = hasPath ? url.pathname : undefined
    const search = url.search !== '' ? url.search : undefined
    const hash = url.hash !== '' ? url.hash : undefined

    to = { path, search, hash }
  }

  if (to.path) {
    to.path = substitutePathParams(to.path)
  }

  if (routerMode === 'hash' && to.hash) {
    to.hash = substitutePathParams(to.hash)
  }

  if (replace) {
    routerHistory.replace(to)
  } else {
    routerHistory.push(to)
  }
}

/** Replace named param in path, e.g. `/foo/:id` => `/foo/123` */
function substitutePathParams(path: string) {
  return path.replace(/:([^/]+)/g, (o, v) => routeParams[v] ?? o)
}
