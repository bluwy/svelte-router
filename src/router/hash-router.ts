import { get } from 'svelte/store'
import { Router } from './base'
import { LocationInput } from '../types'
import { formatPath, replacePathParams } from '../util'

export class HashRouter extends Router {
  getCurrentPath() {
    return formatPath(window.location.hash.slice(1))
  }

  getCurrentLocationInput(): LocationInput {
    return {
      hash: '#' + this.getCurrentPath(),
      search: window.location.search
    }
  }

  getPath(to: LocationInput) {
    return to.path ?? to.hash?.slice(1)
  }

  createUrl(to: LocationInput) {
    const url = new URL(window.location.href)

    if (to.path) {
      url.hash = '#' + to.path
    } else {
      url.hash = to.hash ?? ''
    }

    url.search = to.search
      ? '?' + new URLSearchParams(to.search).toString()
      : ''

    return url.toString()
  }

  createLinkHref(to: LocationInput) {
    const search = to.search ?? ''
    const hash = to.path != null ? '#' + to.path : to.hash ?? ''

    return search + hash
  }

  replaceParams(to: LocationInput, params?: Record<string, string>) {
    const newTo = { ...to }
    const routeParams = params ?? get(this.currentRoute).params

    if (newTo.path) {
      newTo.path = replacePathParams(newTo.path, routeParams)
    }

    if (newTo.hash) {
      newTo.hash = replacePathParams(newTo.hash, routeParams)
    }

    return newTo
  }

  replace(url: string) {
    location.replace(url)
  }

  push(url: string) {
    location.assign(url)
  }
}
