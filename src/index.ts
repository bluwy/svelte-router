import './location-change-shim'
export { default as RouterView } from './RouterView.svelte'
export { default as Link } from './Link.svelte'
export { LinkState, Route } from './router/base'
export { LocationInput, RouteRecord } from './types'
export {
  route,
  createLink,
  navigate,
  initRouter,
  RouterOptions
} from './global'
