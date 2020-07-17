import regexparam from 'regexparam'
import { RedirectOption, RouteRecord, Route } from './create-router'
import { RouterError } from './error'
import {
  formatPath,
  getPathHash,
  getPathParams,
  getPathQuery,
  joinPaths,
  removeHashAndQuery
} from './util'

export interface RouteMatcher {
  /** The current path */
  path: string
  /** Array of all matched routes for this path */
  matched: RouteRecord[]
  /** Pre-compute redirect path */
  redirect?: RedirectOption
  /** Pre-computed regexparam result */
  rpResult: RegexparamResult
}

export interface RegexparamResult {
  keys: string[]
  pattern: RegExp
}

/** Metadata used on route parent when traversing routes in traverseRoutes */
type TraverseRoutesParent = Omit<RouteMatcher, 'rpResult'>

/**
 * Convert the routes as matchers that contains information used in path
 * matching. This will recursively traverse child routes and flatten to a list
 * of matchers.
 */
export function routesToMatchers(routes: RouteRecord[]) {
  const matchers: RouteMatcher[] = []

  // Start from empty parent, assume the routes given is a child of an unknown parent
  traverseRoutes({ path: '', matched: [] }, routes)

  // Recursively loop through all child routes
  function traverseRoutes(
    parent: TraverseRoutesParent,
    children: RouteRecord[]
  ) {
    // Whether one of the children is a catch-all route
    let hasCatchAll = false

    children.forEach((route) => {
      // Check if is catch-all route
      if (formatPath(route.path).startsWith('/*')) {
        hasCatchAll = true
      }

      // Cumulative metadata when traversing parents
      const info: TraverseRoutesParent = {
        path: joinPaths(parent.path, route.path),
        matched: parent.matched.concat(route),
        redirect: route.redirect || parent.redirect
      }

      if (route.children != null && route.children.length > 0) {
        traverseRoutes(info, route.children)
      } else {
        matchers.push({ ...info, rpResult: regexparam(info.path) })
      }
    })

    // Automatically setup catch-all route if children doesn't have one
    if (!hasCatchAll) {
      const path = joinPaths(parent.path, '/*')
      matchers.push({ ...parent, path, rpResult: regexparam(path) })
    }
  }

  return matchers
}

/**
 * Finds a route based on target path and the computed matchers. If matched
 * route has a redirect, it will recursively match until a route (without
 * redirects) is found.
 *
 * @throws {RouterError} If no route matched
 */
export function matchRoute(path: string, matchers: RouteMatcher[]): Route {
  for (let i = 0; i < matchers.length; i++) {
    const matcher = matchers[i]

    if (matcher.rpResult.pattern.test(path)) {
      if (matcher.redirect != null) {
        let redirectPath = matcher.redirect

        if (typeof redirectPath === 'function') {
          const to = matcherToRoute(path, matcher)
          redirectPath = redirectPath(to)
        }

        // Remove self to prevent infinite loop
        const newMatchers = matchers.slice()
        newMatchers.splice(i, 1)

        return matchRoute(redirectPath, newMatchers)
      } else {
        return matcherToRoute(path, matcher)
      }
    }
  }

  // Since a default catch-all route is present, the only time no route will be
  // matched is when an infinite loop occurs.
  // TODO: Better infinite loop error report
  throw new RouterError(`Infinite loop detected routing to "${path}"`)
}

/** Converts a route matcher to route object based on path given */
function matcherToRoute(path: string, matcher: RouteMatcher): Route {
  const routePath = removeHashAndQuery(path)

  return {
    path: routePath,
    fullPath: path,
    matched: matcher.matched,
    params: getPathParams(path, matcher.rpResult),
    hash: getPathHash(path),
    query: getPathQuery(path)
  }
}
