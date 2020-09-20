import { initPathRouter } from '@bjornlu/svelte-router'
import Home from './routes/Home.svelte'

// Use `initHashRouter` for hash mode
initPathRouter([
  { path: '/', component: Home },
  { path: '/user/:id', component: () => import('./routes/User.svelte') },
  { path: '/secret', redirect: '/' }
])
