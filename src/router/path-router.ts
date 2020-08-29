import { Router } from './base'
import { LocationInput } from '../types'
import { formatPath, basePath, joinPaths } from '../util'

export class PathRouter extends Router {
  getCurrentPath() {
    return formatPath(window.location.pathname.replace(basePath, ''))
  }

  getCurrentLocationInput(): LocationInput {
    return {
      path: this.getCurrentPath(),
      hash: window.location.hash,
      search: window.location.search
    }
  }

  getPath(to: LocationInput) {
    return to.path
  }

  createUrl(to: LocationInput) {
    const url = new URL(window.location.href)

    if (to.path) {
      url.pathname = joinPaths(basePath, to.path)
    }

    url.search = to.search
      ? '?' + new URLSearchParams(to.search).toString()
      : ''

    url.hash = to.hash ?? ''

    return url.toString()
  }

  createLinkHref(to: LocationInput) {
    const path = to.path ?? ''
    const search = to.search ?? ''
    const hash = to.hash ?? ''

    return joinPaths(basePath, path) + search + hash
  }

  replaceParams(to: LocationInput) {
    const newTo = { ...to }

    if (newTo.path != null) {
      newTo.path = this.replacePathParams(newTo.path)
    }

    return newTo
  }
}
