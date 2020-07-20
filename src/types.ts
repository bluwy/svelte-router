export interface Route {
  /** The current path, e.g. "/foo/bar" */
  path: string
  /** The full path including hash and query */
  fullPath: string
  /**
   * Key-value pairs of route named parameters (denoted with ":") and wildcard
   * parameters (denoted with "*"). Access wildcard values with the 'wild' key.
   */
  params: Record<string, string>
  /** Key-value pairs of query parameters (The "?" part of the URL) */
  query: Record<string, string>
  /** The path hash */
  hash: string
  /** Array of all matched route records for this path */
  matched: RouteRecord[]
}

export interface RouteRecord {
  /** The route path, e.g. "/foo" */
  path: string
  /** Svelte component */
  component?: any
  /** Redirect to this path */
  redirect?: RedirectOption
  /** Attach custom metadata to this route */
  meta?: any
  /**
   * Array of children routes. If defined, this route component requires a
   * <Route /> component to render the child route.
   */
  children?: RouteRecord[]
}

export type RedirectOption = string | ((to: Route) => string)

export type RouterMode = 'hash' | 'history'

export interface RouterOptions {
  /** The base path of your application */
  base?: string
  /** The routing mode: "hash" or "history". Default: "hash" */
  mode?: RouterMode
  routes?: RouteRecord[]
}

export interface RegexparamResult {
  keys: string[]
  pattern: RegExp
}
