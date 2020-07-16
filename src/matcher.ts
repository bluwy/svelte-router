import regexparam from 'regexparam'
import { RedirectOption, RouteRecord, Route } from './create-router'
import { RouterError } from './error'
import { joinPaths } from './util'

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

/** Metadata used on route parent when traversing routes in traverseRoutes */
type TraverseRoutesParent = Omit<RouteMatcher, 'rpResult'>

interface RegexparamResult {
  keys: string[]
  pattern: RegExp
}

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
    children.forEach((route) => {
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

  throw new RouterError(
    `No route matched for "${path}". A catch-all route must be setup.`
  )
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

/**
 * Get path named params and wildcard params. Uses regexparam to match params.
 * Wildcard params are keyed as "wild". If no params, returns empty object.
 */
function getPathParams(path: string, rpResult: RegexparamResult) {
  // Strip values after '#' or '?'
  path = path.match(/[^\?#]*/)[0]

  const params: Record<string, string> = {}
  const matchResult = path.match(rpResult.pattern)

  // Math result could be null for no match
  if (matchResult) {
    for (let i = 0; i < rpResult.keys.length; i++) {
      const key = rpResult.keys[i]
      params[key] = matchResult[i + 1]
    }
  }

  return params
}

/**
 * Get path hash, e.g. "#foo". Returned hash contains initial "#" character.
 * If no hash found, returns empty string.
 */
function getPathHash(path: string) {
  const hashIndex = path.indexOf('#')

  if (hashIndex < 0) {
    return ''
  }

  const questionIndex = path.indexOf('?')

  if (questionIndex < 0) {
    return path.slice(hashIndex)
  }

  return path.slice(hashIndex, questionIndex)
}

/**
 * Get path query, e.g. { foo: "bar" }. Uses URLSearchParams for query string
 * parsing (No SSR support). If no query found, returns empty object.
 */
function getPathQuery(path: string) {
  const query: Record<string, string> = {}
  const questionIndex = path.indexOf('?')

  if (questionIndex >= 0) {
    const queryStr = path.slice(questionIndex)
    const searchParams = new URLSearchParams(queryStr)

    for (const [k, v] of searchParams.entries()) {
      query[k] = v
    }
  }

  return query
}
