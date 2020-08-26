<script lang="ts">
  import { link, route, Link } from '../package'

  $: id = $route.params.id
</script>

<h2>Profile</h2>
<p>Your ID is {id}</p>

<div>
  <Link to="/profile/:id/welcome">Welcome</Link>
  <a use:link href="/profile/:id/bio">Bio</a>
</div>

<slot />
