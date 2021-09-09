import { initHashRouter } from '@bjornlu/svelte-router'
import Home from './routes/Home.svelte'
import User from './routes/User.svelte'

// Path mode is not compatible with react-router. Hash mode is the only option
initHashRouter([
  { path: '/', redirect: '/home' },
  { path: '/home/*', component: Home },
  { path: '/user/:id', component: User },
  { path: '/secret', redirect: '/' }
])
