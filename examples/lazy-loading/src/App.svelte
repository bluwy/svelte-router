<script>
  import { RouterView, Link } from '@bjornlu/svelte-router'
</script>

<main>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/user/foo">User</Link>
  </nav>
  <RouterView />
</main>
