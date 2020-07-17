import { Readable, Writable } from 'svelte/store'
import { RegexparamResult } from './matcher'

/**
 * Get path named params and wildcard params. Uses regexparam to match params.
 * Wildcard params are keyed as "wild". If no params, returns empty object.
 */
export function getPathParams(path: string, rpResult: RegexparamResult) {
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
export function getPathHash(path: string) {
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
export function getPathQuery(path: string) {
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
    .join()
}

export function removeLeading(str: string, leading: string) {
  return str.startsWith(leading) ? str.slice(leading.length) : str
}

/** Make writable store readonly */
export function readonly<T>(writable: Writable<T>): Readable<T> {
  return { subscribe: writable.subscribe }
}
