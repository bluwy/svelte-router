import { initPathRouter } from '@bjornlu/svelte-router'
import Home from './routes/Home.svelte'
import User from './routes/User.svelte'

// Use `initHashRouter` for hash mode
initPathRouter([
  { path: '/', component: Home },
  { path: '/user/:id', component: User },
  { path: '/secret', redirect: '/' }
])
