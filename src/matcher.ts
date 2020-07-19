import regexparam from 'regexparam'
import { RouterError } from './error'
import type { RedirectOption, RouteRecord, Route } from './router'
import {
  addTrailingSlash,
  formatPath,
  getPathHash,
  getPathParams,
  getPathQuery,
  isCatchAllPath,
  joinPaths,
  removeHashAndQuery
} from './util'

export interface RouteMatcher {
  /** The current formatted path */
  path: string
  /** Array of all matched routes for this path */
  matched: RouteRecord[]
  /** Un-formatted redirect path */
  redirect?: RedirectOption
  /** Pre-computed regexparam result */
  rpResult: RegexparamResult
}

export interface RegexparamResult {
  keys: string[]
  pattern: RegExp
}

/** Metadata used on route parent when traversing routes in traverseRoutes */
type TraverseRoutesParent = Pick<RouteMatcher, 'path' | 'matched'>

/**
 * Convert the routes as matchers that contains information used in path
 * matching. This will recursively traverse child routes and flatten to a list
 * of matchers.
 */
export function routesToMatchers(routes: RouteRecord[] = []) {
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
      const isCatchAll = isCatchAllPath(route.path)

      // Standardize catch-all syntax so it generates proper regex
      const routePath = isCatchAll ? '/*' : route.path

      // Cumulative metadata when traversing parents
      const info: TraverseRoutesParent = {
        path: joinPaths(parent.path, routePath),
        matched: parent.matched.concat(route)
      }

      if (isCatchAll) {
        hasCatchAll = true
      }

      // Ignore children is is catch-all route
      if (!isCatchAll && route.children != null && route.children.length > 0) {
        traverseRoutes(info, route.children)
      } else {
        matchers.push({
          ...info,
          redirect: route.redirect,
          rpResult: regexparam(info.path)
        })
      }
    })

    // Automatically setup catch-all route if children doesn't have one
    if (!hasCatchAll) {
      const path = joinPaths(parent.path, '/*')
      matchers.push({
        path,
        matched: parent.matched,
        rpResult: regexparam(path)
      })
    }
  }

  return matchers
}

/**
 * Finds a route based on target path and the computed matchers. If matched
 * route has a redirect, it will recursively match until a route (without
 * redirects) is found.
 *
 * @param visitedPaths Array of route paths that have been previously visited.
 *   Used to prevent infinite redirects.
 *
 * @throws {RouterError} If infinite redirect loop encountered
 */
export function matchRoute(
  path: string,
  matchers: RouteMatcher[],
  visitedPaths: string[] = []
): Route {
  const routePath = formatPath(removeHashAndQuery(path))
  // Add trailing slash to route path so it properly matches nested routes too.
  // e.g. /foo should match /foo/*
  const matchPath = addTrailingSlash(routePath)

  // Check infinite redirect loop
  // NOTE: This won't 100% prevent infinite loops since different paths may
  // match the same route record (e.g. named param route and wildcard route).
  // We can only confirm an infinite loop happens when a path matches exactly
  // as a previously recorded one.
  if (visitedPaths.includes(routePath)) {
    // Push current path to be used for error printing
    visitedPaths.push(routePath)

    const loopStr = visitedPaths.map((v) => `"${v}"`).join(' -> ')

    throw new RouterError(`Infinite redirect loop encountered: ${loopStr}`)
  }

  // Add self as visited to prevent next redirect loop
  visitedPaths.push(routePath)

  for (const matcher of matchers) {
    if (matcher.rpResult.pattern.test(matchPath)) {
      if (matcher.redirect != null) {
        let redirectPath = matcher.redirect

        if (typeof redirectPath === 'function') {
          const to = matcherToRoute(path, matcher)
          redirectPath = redirectPath(to)
        }

        return matchRoute(redirectPath, matchers, visitedPaths)
      } else {
        // Use path instead of routePath because it may contain query and hash data
        return matcherToRoute(path, matcher)
      }
    }
  }

  // This should never be reached since a default catch-all route is present
  throw new RouterError(`No route found for "${routePath}"`)
}

/** Converts a route matcher to route object based on path given */
function matcherToRoute(path: string, matcher: RouteMatcher): Route {
  const routePath = formatPath(removeHashAndQuery(path))

  return {
    path: routePath,
    fullPath: path,
    matched: matcher.matched,
    params: getPathParams(path, matcher.rpResult),
    query: getPathQuery(path),
    hash: getPathHash(path)
  }
}
