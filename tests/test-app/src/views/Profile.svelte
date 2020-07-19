<script lang="ts">
  import { RouterView } from '../package'
  import { router } from '../router'

  let id: string
  $: id = $router.params.id
</script>

<h2>Profile</h2>
<p>Your ID is {id}</p>

<div>
  <button on:click={() => router.push(`/profile/${id}/welcome`)}>
    Welcome
  </button>
  <button on:click={() => router.push(`/profile/${id}/bio`)}>Bio</button>
</div>

<RouterView />
