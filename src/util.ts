import { Thunk, Promisable } from './types'

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
