import { LocationInput } from './history/base'
import { routerHistory } from './router'

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

  if (replace) {
    routerHistory.replace(to)
  } else {
    routerHistory.push(to)
  }
}
