import { readable } from 'svelte/store'
import { LOCATION_CHANGE } from '../location-change-shim'
import { basePath } from '../base-path'
import { formatPath, joinPaths } from '../util'
import { DUMMY_LOCATION, RouterHistory, LocationInput } from './base'

export class HtmlHistory implements RouterHistory {
  readonly currentLocation = readable(DUMMY_LOCATION, (set) => {
    const handleLocationChange = () => {
      set({
        path: formatPath(window.location.pathname.replace(basePath, '')),
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

    if (to.path) {
      url.pathname = joinPaths(basePath, to.path)
    }

    url.search = to.search
      ? '?' + new URLSearchParams(to.search).toString()
      : ''

    url.hash = to.hash || ''

    return url.toString()
  }
}
