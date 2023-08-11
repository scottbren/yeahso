<script>
  import { page } from '$app/stores';
  import Details from '../../../components/Details.svelte';

  let topic = decodeURIComponent($page.params.topic);
</script>

<Details topic={topic} />
