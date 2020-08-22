import { Thunk, Promisable, LocationInput } from './types'
import { route, routerMode } from './router'

let routeParams: Record<string, string> = {}
route.subscribe(($route) => {
  routeParams = $route.params
})

/** Replace named param in path, e.g. `/foo/:id` => `/foo/123` */
export function replacePathParams(path: string) {
  return path.replace(/:([^/]+)/g, (o, v) => routeParams[v] ?? o)
}

export function replaceLocationInputParams(input: LocationInput) {
  const newInput = { ...input }

  if (newInput.path) {
    newInput.path = replacePathParams(newInput.path)
  }

  if (routerMode === 'hash' && newInput.hash) {
    newInput.hash = replacePathParams(newInput.hash)
  }

  return newInput
}

export function parseLocationInput(to: string): LocationInput {
  const url = new URL(to, 'https://example.com')

  const hasPath = to.length > 0 && !to.startsWith('?') && !to.startsWith('#')

  const path = hasPath ? url.pathname : undefined
  const search = url.search !== '' ? url.search : undefined
  const hash = url.hash !== '' ? url.hash : undefined

  return { path, search, hash }
}

/** Makes sure path has leading "/" and no trailing "/" */
export function formatPath(path: string) {
  if (path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  if (!path.startsWith('/')) {
    path = '/' + path
  }

  return path
}

/** Joins multiple path and also formats it */
export function joinPaths(...paths: string[]) {
  return paths
    .map(formatPath)
    .filter((v) => v !== '/')
    .join('')
}

export function addTrailingSlash(path: string) {
  if (!path.endsWith('/')) {
    path += '/'
  }

  return path
}

export function handleThunk<T>(thunk: Thunk<T>): T {
  return typeof thunk === 'function' ? (thunk as any)() : thunk
}

export function handlePromisable<T>(
  promisable: Promisable<T>,
  callback: (value: T) => void
) {
  if (promisable instanceof Promise) {
    promisable.then(callback)
  } else {
    callback(promisable)
  }
}

/** Attribute is true only if it's not null and value not "false" */
export function isAttributeTrue(el: Element, attrName: string) {
  const attr = el.getAttribute(attrName)
  return attr != null && attr !== 'false'
}
