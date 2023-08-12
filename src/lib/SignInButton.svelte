<script lang="ts">

  export let provider: any;
  let isLoading = false;
  let error = '';

  async function handleSignIn(event) {
    event.preventDefault();
    isLoading = true;
    error = '';

    try {
      const response = await fetch(provider.signinUrl, { method: 'POST' });
      console.log('Raw Response:', response);
      const data = await response.json();
      console.log('Parsed Response:', data);

      if (data.success) {
        const userResponse = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            twitterId: provider.twitterId,
            username: provider.username,
            profilePicture: provider.profilePicture
          })
        });

        if (userResponse.ok) {
          window.location.href = '/swipe'; // Redirect to "/swipe" route
        } else {
          const userData = await userResponse.json();
          error = userData.error || 'Unknown error occurred.';
          console.log('Error:', error);
        }
      } else {
        error = data.error || 'Unknown error occurred.';
        console.log('Error:', error);
      }
    } catch (err) {
      error = 'Failed to connect. Please try again.';
      console.log('Error:', error);
    } finally {
      isLoading = false;
    }
  }
</script>


<style>
  .button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #1da1f2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .button:hover {
    background-color: #0a91db;
  }
</style>

<form on:submit={handleSignIn}>
  <input type="hidden" name="callbackUrl" value="http://172.23.112.1:5173/auth/callback/twitter" />
  <button type="submit" class="button" disabled={isLoading}>
    {isLoading ? 'Signing in...' : `Sign in with ${provider.name}`}
  </button>
  {#if error}
    <p>{error}</p>
  {/if}
</form>
