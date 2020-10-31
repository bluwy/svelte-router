<script>
  import { fly } from 'svelte/transition'
</script>

<div transition:fly={{ y: 300, duration: 1000 }}>Transition test</div>

<style>
  div {
    background-color: aqua;
  }
</style>
