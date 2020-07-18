<script>
  import { RouterView, getRoute, getNavigate } from '../package'
  const route = getRoute()
  const navigate = getNavigate()
</script>

<h2>Profile</h2>
<p>Your ID is {$route.params.id}</p>

<div>
  <button on:click={() => navigate(`/profile/${$route.params.id}/welcome`)}>
    Welcome
  </button>
  <button on:click={() => navigate(`/profile/${$route.params.id}/bio`)}>
    Bio
  </button>
</div>

<RouterView />
