<script lang="ts">
  import { link, route } from '../package'

  $: id = $route.params.id
</script>

<h2>Profile</h2>
<p>Your ID is {id}</p>

<div>
  <a use:link href="/profile/{id}/welcome">Welcome</a>
  <a use:link href="/profile/{id}/bio">Bio</a>
</div>

<slot />
