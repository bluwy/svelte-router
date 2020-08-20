import { Readable } from 'svelte/store'

export interface LocationData {
  path: string
  search: URLSearchParams
  hash: string
}

export interface LocationInput {
  path?: string
  search?: ConstructorParameters<typeof URLSearchParams>[0]
  hash?: string
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
