import regexparam from 'regexparam'
import { RedirectOption, RouteRecord, Route } from './create-router'
import { RouterError } from './error'
import {
  formatPath,
  getPathHash,
  getPathParams,
  getPathQuery,
  joinPaths
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

      if (route.children?.length > 0) {
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

export function matchRoute(path: string, matchers: RouteMatcher[]) {
  const matcher = findMatcher(path, matchers)
  return matcherToRoute(path, matcher)
}

/**
 * Given the target path and the computed matches, this will loop through the
 * matchers' regexparam pattern and find a match. If the match has a redirect,
 * it recursivesly find a match again.
 *
 * @throws {RouterError} If no route matched
 */
export function findMatcher(
  path: string,
  matchers: RouteMatcher[]
): RouteMatcher {
  for (let i = 0; i < matchers.length; i++) {
    const matcher = matchers[i]

    if (matcher.rpResult.pattern.test(path)) {
      if (matcher.redirect) {
        let redirectPath = matcher.redirect

        if (typeof redirectPath === 'function') {
          const to = matcherToRoute(path, matcher)
          redirectPath = redirectPath(to)
        }

        // Remove self to prevent infinite loop
        const newMatchers = matchers.slice().splice(i, 1)

        return findMatcher(redirectPath, newMatchers)
      } else {
        return matcher
      }
    }
  }

  // This would never happen because there's already a default catch-all path.
  // But just in case.
  throw new RouterError(`No route matched for "${path}"`)
}

/** Converts a route matcher to route object based on path given */
function matcherToRoute(path: string, matcher: RouteMatcher): Route {
  return {
    path: matcher.path,
    matched: matcher.matched,
    params: getPathParams(path, matcher.rpResult),
    hash: getPathHash(path),
    query: getPathQuery(path)
  }
}
