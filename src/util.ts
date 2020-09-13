import { Thunk, Promisable, LocationInput } from './types'

export const basePath =
  /*#__PURE__*/
  document.getElementsByTagName('base').length > 0
    ? document.baseURI.replace(window.location.origin, '')
    : '/'

export function parseLocationInput(to: string): LocationInput {
  const url = new URL(to, 'https://example.com')

  return {
    path: to.startsWith('/') ? url.pathname : undefined,
    search: url.search,
    hash: url.hash
  }
}

/** Replace named param in path, e.g. `/foo/:id` => `/foo/123` */
export function replacePathParams(
  path: string,
  params: Record<string, string>
) {
  return path.replace(/:([^/]+)/g, (o, v) => params[v] ?? o)
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

export function handleComponentThunk<T>(thunk: Thunk<T>): T {
  // Svelte components are classes/functions so thunk won't actually work.
  // The workaround is by assuming this syntax `() => import` to be used.
  // Since lambda has no prototype, so we check it before calling thunk.
  return typeof thunk === 'function' && !('prototype' in thunk)
    ? (thunk as any)()
    : thunk
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
