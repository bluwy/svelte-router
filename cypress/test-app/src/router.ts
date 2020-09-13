import { initHashRouter, initPathRouter } from './package'
import Home from './views/Home.svelte'
import Profile from './views/Profile.svelte'
import ProfileWelcome from './views/ProfileWelcome.svelte'
import ProfileBio from './views/ProfileBio.svelte'
import Null from './views/Null.svelte'

const initRouter = __ROUTER_MODE__ === 'hash' ? initHashRouter : initPathRouter

initRouter([
  {
    path: '/',
    component: Home
  },
  {
    path: '/profile/:id',
    component: Profile,
    children: [
      {
        path: '/welcome',
        component: ProfileWelcome
      },
      {
        path: '/bio',
        component: ProfileBio,
        redirect: () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(undefined), 1000)
          })
      }
    ]
  },
  {
    path: '/secret',
    redirect: '/'
  },
  {
    path: '/dynamic',
    component: () => import('./views/Dynamic.svelte')
  },
  {
    path: '/*',
    component: Null
  }
])
