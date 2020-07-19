import { getContext } from 'svelte'
import { Router } from './create-router'

export const ROUTER = {}
export const DEPTH = {}

export const getRouter = (): Router => getContext(ROUTER)
