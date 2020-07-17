import { getContext } from 'svelte'
import { NavigateFn, Route } from './create-router'

export const ROUTE = {}
export const NAVIGATE = {}
export const DEPTH = {}

export const getRoute = (): Route => getContext(ROUTE)
export const getNavigate = (): NavigateFn => getContext(NAVIGATE)
