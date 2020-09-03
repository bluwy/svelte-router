<script lang="ts">
  import {
    navigate,
    initHashRouter,
    initPathRouter,
    RouterView,
    Link
  } from './package'
  import Home from './views/Home.svelte'
  import Profile from './views/Profile.svelte'
  import ProfileWelcome from './views/ProfileWelcome.svelte'
  import ProfileBio from './views/ProfileBio.svelte'
  import Null from './views/Null.svelte'

  let profileId = ''

  const initRouter =
    __ROUTER_MODE__ === 'hash' ? initHashRouter : initPathRouter

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
      path: '/*',
      component: Null
    }
  ])
</script>

<div>
  <div>
    <Link to="/">Home</Link>
    <Link to="/null">Null</Link>
  </div>
  <div>
    <input id="profile-id" type="text" bind:value={profileId} />
    <button
      id="profile-button"
      on:click={() => navigate(`/profile/${profileId}/welcome`)}
    >
      Login
    </button>
  </div>
  <h1>Svelte Routing Test</h1>
  <RouterView />
</div>
