import { initRouter } from './package'
import Home from './views/Home.svelte'
import Profile from './views/Profile.svelte'
import ProfileWelcome from './views/ProfileWelcome.svelte'
import ProfileBio from './views/ProfileBio.svelte'
import Null from './views/Null.svelte'

initRouter({
  mode: 'history',
  routes: [
    {
      path: '/home',
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
              setTimeout(() => {
                resolve(undefined)
              }, 1000)
            })
        }
      ]
    },
    {
      path: '/secret',
      redirect: () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve('/home')
          }, 1000)
        })
    },
    {
      path: '/*',
      component: Null
    }
  ]
})
