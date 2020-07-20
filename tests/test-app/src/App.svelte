<script lang="ts">
  import { link, router, RouterView } from './package'

  let profileId = ''
</script>

<div>
  <div use:link>
    <a href="/home">Home</a>
    <a href="/welcome">Welcome</a>
    <a href="/non-exist">Non exist</a>
  </div>
  <div>
    <input id="profile-id" type="text" bind:value={profileId} />
    <button on:click={() => router.push(`/profile/${profileId}`)}>Login</button>
  </div>
  <h1>Welcome to Svelte Routing Test</h1>
  <RouterView />
</div>
