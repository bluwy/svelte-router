import { RegexparamResult } from './types'

export function isCatchAllPath(path: string) {
  return path === '' || path.startsWith('*') || path.startsWith('/*')
}

/**
 * Get path named params and wildcard params. Uses regexparam to match params.
 * Wildcard params are keyed as "wild". If no params, returns empty object.
 */
export function getPathParams(path: string, rpResult: RegexparamResult) {
  // Add trailing slash so it properly matches nested routes too.
  // e.g. /foo should match /foo/*
  // This way the wild property can be an empty string, otherwise undefined
  path = addTrailingSlash(removeHashAndQuery(path))

  const params: Record<string, string> = {}
  const matchResult = path.match(rpResult.pattern)

  // Math result could be null for no match
  if (matchResult) {
    for (let i = 0; i < rpResult.keys.length; i++) {
      const key = rpResult.keys[i]
      params[key] = matchResult[i + 1]
    }

    if ('wild' in params) {
      params.wild = formatPath(params.wild)
    }
  }

  return params
}

/**
 * Get path query, e.g. { foo: "bar" }. Uses URLSearchParams for query string
 * parsing (No SSR support). If no query found, returns empty object.
 */
export function getPathQuery(path: string) {
  const query: Record<string, string> = {}
  const queryStr = path.match(/\?[^#]*/)

  if (queryStr != null) {
    const searchParams = new URLSearchParams(queryStr[0])

    for (const [k, v] of searchParams.entries()) {
      query[k] = v
    }
  }

  return query
}

/**
 * Get path hash, e.g. "#foo". Returned hash contains initial "#" character.
 * If no hash found, returns empty string.
 */
export function getPathHash(path: string) {
  const match = path.match(/#.*/)
  return match != null ? match[0] : ''
}

/** Makes sure path has leading "/" and no trailing "/" */
export function formatPath(path: string) {
  if (path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  if (!path.startsWith('/')) {
    path = '/' + path
  }

  return path
}

export function joinPaths(...paths: string[]) {
  return paths
    .map(formatPath)
    .filter((v) => v !== '/')
    .join('')
}

export function addTrailingSlash(path: string) {
  if (!path.endsWith('/')) {
    path += '/'
  }

  return path
}

export function removeHashAndQuery(path: string) {
  return path.match(/[^\?#]*/)![0]
}

export function removeLeading(str: string, leading: string) {
  return str.startsWith(leading) ? str.slice(leading.length) : str
}
