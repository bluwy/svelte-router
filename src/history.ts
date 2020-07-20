import type { RouterMode } from './types'
import {
  createBrowserHistory,
  createHashHistory,
  History,
  State
} from 'history'

export function createHistory(mode: RouterMode): History<State> {
  switch (mode) {
    case 'hash':
      return createHashHistory()
    case 'history':
      return createBrowserHistory()
  }
}
