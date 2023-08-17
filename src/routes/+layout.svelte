<script lang="ts">
  import { page } from "$app/stores";

  let authenticated = false;

  try {
    if($page.data.session?.user) {
      authenticated = true;
      console.log("layout session", $page.data.session);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
</script>


<div>
  <header>
    <div class="signedInStatus">
      <p class="nojs-show loaded">
        {#if $page.data.session && $page.data.session.user}          {#if $page.data.session.user?.image}
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
          <a href="/auth/signin" class="sign-out-button" data-sveltekit-preload-data="off">Sign in</a>
        {/if}
      </p>
    </div>
    <nav>
        <ul class="navItems">
          <li class="navItem"><a href="/">home</a></li>
          <li class="navItem"><a href="/swipe">feed</a></li>
          <li class="navItem"><a href="/swipe">top</a></li>
          <li class="navItem"><a href="/post">Post</a></li>

        </ul>
    </nav>
    
    
  </header>

  <slot />

</div>

<style>
  /* Global styles */
  :global(body) {
    font-family: 'Arial', sans-serif; 
    padding: 0;
    margin: 0;
    max-width: 100%;
    background: #2B2632; 
    color: #C9C9C9; 
  }

  :root {
    --background-color: #2B2632;
    --gradient-start: #D23D58;
    --gradient-end: #FFD53F;
    --transition-speed: 0.3s;
    --font: 'Jockey One', sans-serif;
  }

  header {
    background: #2B2632;
    padding: 1rem 2%;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1); 
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    position: relative;
    z-index: 1000;
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
    gap: 2rem;
    margin: 0;
    padding: 0;
  }

  .navItem a {
    text-decoration: none;
    color: #C9C9C9; 
    padding: 0.5rem 1.5rem;
    border-radius: 0.3rem;
    font-size: 1.1em;
    font-weight: 600;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
    position: relative;
  }

  .navItem a:hover {
    background-color: #e7e7e7;
    color: #111;
    transform: translateY(-2px);
  }

  .navItem a:active {
    transform: translateY(0);
    background-color: #d7d7d7;
  }

  .sign-out-button {
    text-decoration: none;
    padding: 10px 20px;
    font-size: 1em;
    background-color: #333; 
    color: white; 
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    outline: none;
    margin-top: 20px;
  }

  .sign-out-button:hover {
    background-color: #555;
  }
</style>

