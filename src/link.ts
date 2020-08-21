import { navigate } from './navigate'
import { isAttributeTrue } from './util'

/**
 * Use this action on an anchor tag to automatically handle router navigation.
 * Can also be used on any element so its decendants' anchor tags are handled
 * as well.
 *
 * Only href that starts with "/", "?" or "#" will be routed. If a href matches
 * this pattern but doesn't need routing, add a `noroute` attribute to the
 * anchor tag.
 *
 * The navigation will `push` by default. Add a `replace` attribute on the
 * anchor tag to `replace`.
 */
export function link(node: HTMLElement) {
  node.addEventListener('click', handleClick)

  return {
    destroy: () => node.removeEventListener('click', handleClick)
  }
}

function handleClick(e: MouseEvent) {
  if (
    e.ctrlKey ||
    e.metaKey ||
    e.altKey ||
    e.shiftKey ||
    e.button ||
    e.defaultPrevented
  ) {
    return
  }

  const a = (e.target as Element).closest('a')

  if (a != null) {
    const href = a.getAttribute('href')

    if (
      href != null &&
      (href.startsWith('/') || href.startsWith('?') || href.startsWith('#')) &&
      !isAttributeTrue(a, 'noroute')
    ) {
      e.preventDefault()
      navigate(href, isAttributeTrue(a, 'replace'))
    }
  }
}
