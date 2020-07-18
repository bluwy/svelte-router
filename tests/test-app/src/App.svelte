<script>
  import { RouterView } from './package'
  import { router } from './router'

  let profileId = ''
</script>

<div>
  <div>
    <button on:click={() => router.navigate('/home')}>Home</button>
    <button on:click={() => router.navigate('/profile')}>Profile</button>
    <button on:click={() => router.navigate('/non-exist')}>Non exist</button>
  </div>
  <div>
    <input id="profile-id" type="text" bind:value={profileId} />
    <button on:click={() => router.navigate(`/profile/${profileId}`)}>
      Login
    </button>
  </div>
  <h1>Welcome to Svelte Routing Test</h1>
  <RouterView {router} />
</div>
