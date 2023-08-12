<script lang="ts">
    export let provider: any;
  
    async function getSignInUrl() {
      try {
        const response = await fetch('/api/auth/twitter/signin');
        const { signinUrl } = await response.json();
        return signinUrl;
      } catch (error) {
        console.error('Error fetching sign-in URL:', error);
        return null;
      }
    }
  </script>
  
  <form action={await getSignInUrl()} method="POST">
    {#if provider.callbackUrl}
      <input type="hidden" name="callbackUrl" value={encodeURIComponent(provider.callbackUrl)} />
    {/if}
    <button type="submit" class="button">
      <slot>Sign in with {provider.name}</slot>
    </button>
  </form>
  
  <style>
    /* Your styles here */
  </style>
  