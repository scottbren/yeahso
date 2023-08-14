<script>
  import { page } from '$app/stores'; // Import the page store to access route params
  import Profile from '../../../components/Profile.svelte';
  
  // Extract userId from the page params
  let userId = $page.params.userId;
</script>

<Profile userId={userId} />
