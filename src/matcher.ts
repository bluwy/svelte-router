import regexparam from 'regexparam'
import { addTrailingSlash, formatPath, joinPaths } from './util'
import { RouteRecord } from './types'

export interface MatchedRoute {
  /** The current path, e.g. "/foo/bar" */
  path: string
  /**
   * Key-value pairs of route named parameters (denoted with ":") and wildcard
   * parameters (denoted with "*"). Access wildcard values with the 'wild' key.
   */
  params: Record<string, string>
  /** Array of all matched route records for this path */
  matched: RouteRecord[]
}

interface RouteMatchData {
  /** The current formatted path */
  path: string
  pattern: RegExp
  keys: string[]
  /** Array of all matched routes for this path */
  matched: RouteRecord[]
}

/** Metadata used on route parent when traversing routes in buildDatas */
type RouteMatchParent = Pick<RouteMatchData, 'path' | 'matched'>

export class RouteMatcher {
  private matchDatas: RouteMatchData[] = []

  constructor(routes: RouteRecord[] = []) {
    this.buildDatas(routes)
  }

  /** Finds a route based on target path and the computed matchers. */
  matchRoute(path: string): MatchedRoute | undefined {
    // Add trailing slash to route path so it properly matches nested routes too.
    // e.g. /foo should match /foo/*
    const matchPath = addTrailingSlash(path)

    for (const matchData of this.matchDatas) {
      const params: Record<string, string> = {}
      const matchResult = matchPath.match(matchData.pattern)

      if (matchResult) {
        for (let i = 0; i < matchData.keys.length; i++) {
          params[matchData.keys[i]] = matchResult[i + 1]
        }

        if ('wild' in params) {
          params.wild = formatPath(params.wild)
        }

        return {
          path,
          params,
          matched: matchData.matched
        }
      }
    }
  }

  /**
   * Convert the routes as matchers that contains information used in path
   * matching. This will recursively traverse child routes and flatten to a list
   * of matchers.
   */
  private buildDatas(
    routes: RouteRecord[],
    parentData: RouteMatchParent = { path: '', matched: [] }
  ) {
    routes.forEach((route) => {
      // Cumulative metadata when traversing parents
      const parent: RouteMatchParent = {
        path: joinPaths(parentData.path, route.path),
        matched: parentData.matched.concat(route)
      }

      if (route.children?.length) {
        this.buildDatas(route.children, parent)
      } else {
        this.matchDatas.push({
          ...parent,
          ...regexparam(parent.path)
        })
      }
    })
  }
}
