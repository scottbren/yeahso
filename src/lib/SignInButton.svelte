<script lang="ts">
  export let provider: any
</script>

<form action={provider.signinUrl} method="POST">
  {#if provider.callbackUrl}
    <input type="hidden" name="callbackUrl" value={"http%3A%2F%2F172.24.16.1%2F5173%2Fauth%2Fcallback%2Ftwitter"} />
    {/if}
  <button type="submit" class="button">
    <slot>Sign in with {provider.name}</slot>
  </button>
</form>