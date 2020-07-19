import { createRouter } from './package'
import { setRouter } from './router'
import Home from './views/Home.svelte'
import Profile from './views/Profile.svelte'
import ProfileWelcome from './views/ProfileWelcome.svelte'
import ProfileBio from './views/ProfileBio.svelte'
import ProfileBioFoo from './views/ProfileBioFoo.svelte'
import ProfileBioBar from './views/ProfileBioBar.svelte'
import Null from './views/Null.svelte'

const router = createRouter({
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
          children: [
            { path: '/foo', component: ProfileBioFoo },
            { path: '/bar', component: ProfileBioBar }
          ]
        }
      ]
    },
    {
      path: '/welcome',
      redirect: '/profile/fake/welcome'
    },
    {
      path: '/*',
      component: Null
    }
  ]
})

setRouter(router)
