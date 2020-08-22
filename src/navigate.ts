import { LocationInput } from './types'
import { routerHistory } from './router'
import { parseLocationInput, replaceLocationInputParams } from './util'

/**
 * Navigate using an offset in the current history. Works the same way as
 * [`history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History/go).
 */
export function navigate(to: number): void
/**
 * Navigate using a string or in object form.
 *
 * In hash mode, `path` will take precedence over `hash`.
 * e.g. `/foo#/bar` will navigate to `/foo`
 *
 * @example
 * navigate('/foo/bar')
 * navigate('/foo/bar?key=value')
 * navigate('?key=value')
 * navigate('#hey')
 * navigate('#/foo/bar')
 * navigate({ path: '/foo/bar', search: { key: 'value' } })
 * navigate({ path: '/foo/bar', hash: '#hey' })
 * navigate({ search: '?key=value' })
 */
export function navigate(to: string | LocationInput, replace?: boolean): void
export function navigate(to: number | string | LocationInput, replace = false) {
  if (typeof to === 'number') {
    routerHistory.go(to)
    return
  }

  if (typeof to === 'string') {
    to = parseLocationInput(to)
  }

  // Replace, for example, ":id" to `$route.params.id`
  to = replaceLocationInputParams(to)

  if (replace) {
    routerHistory.replace(to)
  } else {
    routerHistory.push(to)
  }
}
