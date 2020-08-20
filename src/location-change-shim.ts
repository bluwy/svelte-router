export const LOCATION_CHANGE = 'locationchange'

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
