<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    onMount(async () => {
      // Assuming Twitter returns data in the URL, extract it (e.g., using the URLSearchParams API or other means)
      // For demonstration purposes, we're using dummy data
      const userData = {
        twitterId: "12345",
        username: "exampleUser",
        profilePictureUrl: "https://example.com/pic.jpg",
      };
  
      // Send the user data to your backend to either create a new user or fetch an existing user
      const backendResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (backendResponse.ok) {
        console.log('User data processed:', await backendResponse.json());
        // Redirect to home or dashboard after successful processing
        goto('/');
      } else {
        console.error('Error processing user data');
      }
    });
  </script>
  