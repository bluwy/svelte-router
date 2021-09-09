<script>
  import { RouterView, Link } from '@bjornlu/svelte-router'
</script>

<main>
  This is the Svelte component with svelte-router.
  <nav>
    <Link to="/">Home</Link>
    <Link to="/home/details">Home with details</Link>
    <Link to="/user/foo">User</Link>
  </nav>
  <RouterView />
</main>
