export interface RouteRecord {
  /** The route path, e.g. "/foo" */
  path: string
  /** Svelte component */
  component?: any
  /**
   * Array of children routes. If defined, this route component requires a
   * <slot /> component to render the child route.
   */
  children?: RouteRecord[]
}
