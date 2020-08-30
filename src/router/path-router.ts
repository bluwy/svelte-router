import { get } from 'svelte/store'
import { Router } from './base'
import { LocationInput } from '../types'
import { formatPath, basePath, joinPaths, replacePathParams } from '../util'

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

  replaceParams(to: LocationInput, params?: Record<string, string>) {
    const newTo = { ...to }
    const routeParams = params ?? get(this.currentRoute).params

    if (newTo.path) {
      newTo.path = replacePathParams(newTo.path, routeParams)
    }

    return newTo
  }
}
