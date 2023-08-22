<script>
  import Swipe from "../../components/Swipe.svelte"
  import { page } from "$app/stores"

  let user = $page.data.session.user
</script>

{#if user}
  <Swipe {user} />
{:else}
  <p>Loading...</p>
{/if}
