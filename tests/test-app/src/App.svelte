<script lang="ts">
  import { link, navigate, RouterView } from './package'

  let profileId = ''
</script>

<div>
  <div use:link>
    <a href="/home">Home</a>
    <a href="/null">Null</a>
  </div>
  <div>
    <input id="profile-id" type="text" bind:value={profileId} />
    <button id="profile-button" on:click={() => navigate(`/profile/${profileId}/welcome`)}>
      Login
    </button>
  </div>
  <h1>Svelte Routing Test</h1>
  <RouterView />
</div>
