import type { Router } from './package'

export let router: Router

export function setRouter(r: Router) {
  router = r
}
