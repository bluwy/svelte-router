<script lang="ts">
  import { RouterView } from './package'
  import { router } from './router'

  let profileId = ''
</script>

<div>
  <div>
    <button on:click={() => router.push('/home')}>Home</button>
    <button on:click={() => router.push('/welcome')}>Welcome</button>
    <button on:click={() => router.push('/non-exist')}>Non exist</button>
  </div>
  <div>
    <input id="profile-id" type="text" bind:value={profileId} />
    <button on:click={() => router.push(`/profile/${profileId}`)}>Login</button>
  </div>
  <h1>Welcome to Svelte Routing Test</h1>
  <RouterView {router} />
</div>
