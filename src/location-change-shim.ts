/*
  Enable listening to all location changes that may be triggered by `pushState`,
  `replaceState`, `onpopstatte` and `onhashchange`. This enables the router
  to update whenever needed.

  No side-effects introduced.
*/

export const LOCATION_CHANGE = 'svelterouterlocationchange'

const originalPushState = history.pushState
const originalReplaceState = history.replaceState

const dispatch = () => window.dispatchEvent(new CustomEvent(LOCATION_CHANGE))

history.pushState = function (...args) {
  originalPushState.apply(this, args)
  dispatch()
}

history.replaceState = function (...args) {
  originalReplaceState.apply(this, args)
  dispatch()
}

window.addEventListener('popstate', dispatch)
window.addEventListener('hashchange', dispatch)
