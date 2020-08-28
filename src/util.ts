import { Thunk, Promisable, LocationInput } from './types'

export const basePath =
  document.getElementsByTagName('base').length > 0
    ? document.baseURI.replace(window.location.origin, '')
    : '/'

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
