<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    
    let profile;
    let error = null;

    onMount(async () => {
        try {
            console.log("test")
            // Assuming you pass the profile via some method, e.g., a prop or a store
            const response = await fetch(`/users/twitter/${profile.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profile),
            });

            if (!response.ok) {
                throw new Error("Failed to handle user data in our database.");
            }
            
            // Redirect to /swipe if successful
            window.location.href = "/swipe";
        } catch (err) {
            console.error("Error during Twitter auth callback:", err);
            error = "Error during authentication.";
        }
    });
</script>

{#if error}
    <div class="error">
        {error}
    </div>
{:else}
    <div class="loading">
        Authenticating...
    </div>
{/if}

<style>
    .error {
        color: red;
    }

    .loading {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: 6px solid #f3f3f3; /* Light grey */
        border-top: 6px solid #3498db; /* Blue */
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
