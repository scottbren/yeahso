
<script lang="ts">
  import { page } from "$app/stores"
  if($page.data.session) {
    console.log($page.data.session.user)
  }
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
        </ul>
    </nav>
    
    
  </header>
  <slot />
</div>

<style>
  /* Global styles */
  :global(body) {
    font-family: 'Courier New', Courier, monospace; /* Matrix-like monospace font */
    padding: 0;
    margin: 0;
    max-width: 100%;
    background: black; /* Matrix black background */
    color: #33FF33; /* Matrix green */
}

  
header {
    background-color: black; /* Matching Matrix background */
    padding: 1rem 2%;
    box-shadow: 0px 2px 10px rgba(0, 255, 0, 0.5); /* Green shadow for depth */
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
    gap: 2rem;  /* Increase the spacing between links */
    margin: 0;
    padding: 0;
  }

  .navItem a {
    text-decoration: none;
    color: #33FF33; /* Matrix green for links */
    padding: 0.5rem 1.5rem;
    border-radius: 0.3rem;
    font-size: 1.1em;
    font-weight: 600;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
    position: relative;
}

.navItem a:hover {
    background-color: rgba(51, 255, 51, 0.1); /* Slight green background on hover */
    color: white;
    transform: translateY(-2px);
}

.navItem a:active {
    transform: translateY(0);
    background-color: rgba(51, 255, 51, 0.2); /* Slightly darker green background on active state */
}

  
.sign-out-button {
    text-decoration: none;
    padding: 10px 20px;
    font-size: 1em;
    background-color: #33FF33; /* Matrix green for the button */
    color: black; /* Black text for contrast */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    outline: none;
    margin-top: 20px;
}

.sign-out-button:hover {
    background-color: #28CC28; /* Slightly darker green on hover */
}

</style>