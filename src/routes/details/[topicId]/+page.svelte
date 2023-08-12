<script>
  import { page } from '$app/stores';
  import Details from '../../../components/Details.svelte';

  let topicId = $page.params.topicId; // Assuming your route has :topicId as a parameter
</script>

<Details topicId={topicId} />
