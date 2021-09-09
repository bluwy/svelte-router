<script lang="ts">
  import { navigate, RouterView, Link } from './package'

  let profileId = ''
</script>

<div>
  <div>
    <Link to="/">Home</Link>
    <Link to="/null">Null</Link>
    <Link to="/dynamic">Dynamic</Link>
    <Link to="/transition">Transition</Link>
    <Link to="/" replace>Home replace</Link>
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
