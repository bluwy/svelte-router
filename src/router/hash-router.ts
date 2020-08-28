import { Router } from './base'
import { LocationInput } from '../types'
import { formatPath } from '../util'

export class HashRouter extends Router {
  getCurrentPath() {
    return formatPath(window.location.hash.slice(1))
  }

  getPath(to: LocationInput) {
    return to.path ?? to.hash?.slice(1)
  }

  createUrl(to: LocationInput) {
    const url = new URL(window.location.href)

    if (to.hash != null) {
      url.hash = to.hash
    }

    if (to.path != null) {
      url.hash = '#' + to.path
    }

    url.search =
      to.search != null ? '?' + new URLSearchParams(to.search).toString() : ''

    return url.toString()
  }

  createLinkHref(to: LocationInput) {
    const search = to.search ?? ''
    const hash = to.path != null ? '#' + to.path : to.hash ?? ''

    return search + hash
  }

  replaceParams(to: LocationInput) {
    const newTo = { ...to }

    if (newTo.path != null) {
      newTo.path = this.replacePathParams(newTo.path)
    }

    if (newTo.hash != null) {
      newTo.hash = this.replacePathParams(newTo.hash)
    }

    return newTo
  }
}
