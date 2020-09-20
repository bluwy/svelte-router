export type Thunk<T> = T | (() => T)

export type Promisable<T> = T | Promise<T>

export interface LocationInput {
  path?: string
  search?: ConstructorParameters<typeof URLSearchParams>[0]
  hash?: string
}

export interface RouteRecord {
  /** The route path, e.g. "/foo" */
  path: string
  /** Svelte component */
  component?: Thunk<Promisable<Function | { default: Function } | undefined>>
  /** Redirect to another path if route match */
  redirect?: Thunk<Promisable<string | LocationInput | undefined>>
  /**
   * Array of children routes. If defined, this route component requires a
   * `<slot />` component to render the children routes.
   */
  children?: RouteRecord[]
}
