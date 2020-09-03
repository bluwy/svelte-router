// Listen to location changes that are triggered by:
// - pushState
// - replaceState
// - onpopstate
// - onhashchange

export const LOCATION_CHANGE = 'svelterouterlocationchange'

const originalPushState = history.pushState
const originalReplaceState = history.replaceState

let prevLocation = ''

function dispatch() {
  if (window.location.href !== prevLocation) {
    window.dispatchEvent(new CustomEvent(LOCATION_CHANGE))
    prevLocation = window.location.href
  }
}

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
