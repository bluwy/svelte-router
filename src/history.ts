import {
  createBrowserHistory,
  createHashHistory,
  History,
  State
} from 'history'

export type RouterMode = 'hash' | 'history'

export function createHistory(mode: RouterMode): History<State> {
  switch (mode) {
    case 'hash':
      return createHashHistory()
    case 'history':
      return createBrowserHistory()
  }
}
