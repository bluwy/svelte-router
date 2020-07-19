export function createLinkAction(push: Function, replace: Function) {
  /**
   * Use this action on an anchor tag to automatically handle router navigation.
   * Can also be used on any element so its nested anchor tags will be handled
   * as well.
   *
   * Only href that starts with "/" will be routed. This behavior can be skipped
   * by adding a `noroute` attribute on the anchor tag.
   *
   * The navigation will use `push` by default. Add a `replace` attribute on the
   * anchor tag to use `replace`.
   */
  return (node: HTMLElement) => {
    node.addEventListener('click', handleClick)

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
        const href = a.href

        if (href.startsWith('/') && !a.getAttribute('noroute')) {
          e.preventDefault()

          if (a.getAttribute('replace')) {
            replace(href)
          } else {
            push(href)
          }
        }
      }
    }

    return {
      destroy() {
        node.removeEventListener('click', handleClick)
      }
    }
  }
}
