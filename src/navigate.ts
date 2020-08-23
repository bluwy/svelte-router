import { LocationInput } from './types'
import { route, routerMode, routerHistory } from './router'

let routeParams: Record<string, string> = undefined!

/**
 * Navigate using an offset in the current history. Works the same way as
 * [`history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History/go).
 */
export function navigate(to: number): void
/**
 * Navigate using a string or in object form.
 *
 * In hash mode, `path` will take precedence over `hash`.
 * e.g. `/foo#/bar` will navigate to `/foo`
 *
 * @example
 * navigate('/foo/bar')
 * navigate('/foo/bar?key=value')
 * navigate('?key=value')
 * navigate('#hey')
 * navigate('#/foo/bar')
 * navigate({ path: '/foo/bar', search: { key: 'value' } })
 * navigate({ path: '/foo/bar', hash: '#hey' })
 * navigate({ search: '?key=value' })
 */
export function navigate(to: string | LocationInput, replace?: boolean): void
export function navigate(to: number | string | LocationInput, replace = false) {
  if (typeof to === 'number') {
    routerHistory.go(to)
    return
  }

  if (typeof to === 'string') {
    to = parseLocationInput(to)
  }

  // Replace, for example, ":id" to `$route.params.id`
  to = replaceLocationInputParams(to)

  if (replace) {
    routerHistory.replace(to)
  } else {
    routerHistory.push(to)
  }
}

/** Replace named param in path, e.g. `/foo/:id` => `/foo/123` */
export function replacePathParams(path: string) {
  if (routeParams == null) {
    route.subscribe(($route) => {
      routeParams = $route.params
    })
  }

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
