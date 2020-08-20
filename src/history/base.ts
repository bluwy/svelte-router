import { Readable } from 'svelte/store'
import { LocationInput } from '../types'

export interface LocationData {
  path: string
  search: URLSearchParams
  hash: string
}

export interface RouterHistory {
  currentLocation: Readable<LocationData>
  go(delta: number): void
  push(to: LocationInput): void
  replace(to: LocationInput): void
}

export const DUMMY_LOCATION: LocationData = {
  path: '/',
  search: new URLSearchParams(),
  hash: ''
}
