import './location-change-shim'
export { default as RouterView } from './components/RouterView.svelte'
export { default as Link } from './components/Link.svelte'
export { LinkState, Route } from './router/base'
export { LocationInput, RouteRecord } from './types'
export {
  route,
  createLink,
  navigate,
  initHashRouter,
  initPathRouter
} from './global'
