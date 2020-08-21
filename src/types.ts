export type Thunk<T> = T | (() => T)

export type Promisable<T> = T | Promise<T>

export type RouterMode = 'hash' | 'history'

export interface LocationInput {
  path?: string
  search?: ConstructorParameters<typeof URLSearchParams>[0]
  hash?: string
}

export type RedirectOption = Thunk<
  Promisable<string | LocationInput | undefined>
>

export interface RouteRecord {
  /** The route path, e.g. "/foo" */
  path: string
  /** Svelte component */
  component?: any
  redirect?: RedirectOption
  /**
   * Array of children routes. If defined, this route component requires a
   * <slot /> component to render the child route.
   */
  children?: RouteRecord[]
}
