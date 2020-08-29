<script lang="ts">
  import { route, Link } from '../package'

  $: id = $route.params.id
</script>

<h2>Profile</h2>
<p>Your ID is {id}</p>

<div>
  <Link to="/profile/:id/welcome">Welcome</Link>
  <Link to="/profile/:id/bio">Bio</Link>
</div>

<slot />
