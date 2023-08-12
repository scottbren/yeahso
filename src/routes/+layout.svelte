<script lang="ts">
  import { page } from "$app/stores"
</script>

<div>
  <header>
    <div class="signedInStatus">
      <p class="nojs-show loaded">
        {#if $page.data.session}
          {#if $page.data.session.user?.image}
            <span
              style="background-image: url('{$page.data.session.user.image}')"
              class="avatar"
            />
          {/if}
          <span class="signedInText">
            <small>Signed in as</small><br />
            <strong
              >{$page.data.session.user?.email ??
                $page.data.session.user?.name}</strong
            >
          </span>
          <a href="/auth/signout" class="sign-out-button" data-sveltekit-preload-data="off">Sign out</a>
        {:else}
          <span class="notSignedInText">You are not signed in</span>
          <a href="/auth/signin" class="sign-out-button" data-sveltekit-preload-data="off">Sign in</a>
        {/if}
      </p>
    </div>
    <nav>
      <ul class="navItems">
        <li class="navItem"><a href="/swipe">feed</a></li>
        <li class="navItem"><a href="/profile">profile</a></li>
      </ul>
    </nav>
  </header>
  <slot />
</div>

<style>
  /* Global styles */
  :global(body) {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
    padding: 0;
    margin: 0;
    max-width: 100%;
    background: #fff;
    color: rgb(20, 18, 18);
  }
  
  header {
    background-color: rgba(54, 54, 54, 0.95);
    padding: 1rem 2%; 
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }

  nav {
    order: 1;
  }

  .signedInStatus {
    display: flex;
    align-items: center;
    gap: 1rem;
    order: 2;
  }

  .loaded {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .avatar {
    border-radius: 50%;
    height: 2.8rem;
    width: 2.8rem;
    background-color: white;
    background-size: cover;
    background-repeat: no-repeat;
    margin-right: 0.5rem;
  }


  .navItems {
    display: flex;
    list-style: none;
    gap: 2rem;  /* Increase the spacing between links */
    margin: 0;
    padding: 0;
  }

  .navItem a {
    text-decoration: none;
    color: whitesmoke;
    padding: 0.5rem 1.5rem;  /* Increased horizontal padding */
    border-radius: 0.3rem;
    font-size: 1.1em;  /* Slightly larger font size */
    font-weight: 600;  /* Make the links a bit bolder */
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;  /* Transition for smoother effects */
    position: relative;  /* For the underline effect */
  }

  .navItem a:hover {
    background-color: rgba(148, 148, 148, 0.05);
    color: #333;  /* Slightly darker text on hover */
    transform: translateY(-2px);  /* Lift the link a bit on hover */
    
  }

  .navItem a:active {
    transform: translateY(0);  /* Reset the lift effect when link is active */
    background-color: rgba(0, 0, 0, 0.1);  /* Slightly darker background on active state */
  }

  
  .sign-out-button {
    text-decoration: none;
    padding: 10px 20px;
    font-size: 1em;
    background-color: #ff4d4d; /* Red color for sign-out */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    outline: none;
    margin-top: 20px; /* Space from other elements */
  }

  .sign-out-button:hover {
    background-color: #e63939; /* Slightly darker red on hover */
  }
</style>