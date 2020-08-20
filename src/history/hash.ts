import { readable } from 'svelte/store'
import { LOCATION_CHANGE } from '../location-change-shim'
import { formatPath } from '../util'
import { DUMMY_LOCATION, RouterHistory } from './base'
import { LocationInput } from '../types'

export class HashHistory implements RouterHistory {
  readonly currentLocation = readable(DUMMY_LOCATION, (set) => {
    const handleLocationChange = () => {
      set({
        path: formatPath(window.location.hash.slice(1)),
        search: new URLSearchParams(window.location.search),
        hash: window.location.hash
      })
    }

    handleLocationChange()

    window.addEventListener(LOCATION_CHANGE, handleLocationChange)

    return () =>
      window.removeEventListener(LOCATION_CHANGE, handleLocationChange)
  })

  go(delta: number) {
    history.go(delta)
  }

  push(to: LocationInput) {
    const href = this.createHref(to)
    history.pushState(href, '', href)
  }

  replace(to: LocationInput) {
    const href = this.createHref(to)
    history.replaceState(href, '', href)
  }

  private createHref(to: LocationInput) {
    const url = new URL(window.location.href)

    if (to.hash) {
      url.hash = to.hash
    }

    if (to.path) {
      url.hash = '#' + to.path
    }

    url.search = to.search
      ? '?' + new URLSearchParams(to.search).toString()
      : ''

    return url.toString()
  }
}
