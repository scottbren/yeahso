<script lang="ts">
  import { page } from "$app/stores"

  let authenticated = false

  try {
    if ($page.data.session?.user) {
      authenticated = true
      console.log("layout session", $page.data.session)
    }
  } catch (error) {
    console.error("An error occurred:", error)
  }
</script>

<div>
  <header>
    <div class="signedInStatus">
      <p class="nojs-show loaded">
        {#if $page.data.session && $page.data.session.user}
          <a
            href={`/profile/${
              $page.data.session.user?.twitterId || $page.data.session.user?._id
            }`}
            class="profile-link"
          >
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
          </a>

          <a
            href="/auth/signout"
            class="sign-out-button"
            data-sveltekit-preload-data="off">Sign out</a
          >
        {/if}
      </p>
    </div>
    <nav>
      <ul class="navItems">
        <li class="navItem"><a href="/swipe">feed</a></li>
        <li class="navItem"><a href="/top">top</a></li>
        <li class="navItem"><a href="/post">post</a></li>
      </ul>
    </nav>
  </header>

  <slot />
</div>

<style>
  /* Global styles */
  :global(body) {
    font-family: "Jockey One", sans-serif;
    padding: 0;
    margin: 0;
    max-width: 100%;
    background: #2b2632;
    color: #c9c9c9;
  }

  .profile-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    color: inherit;
    transition: opacity 0.3s;
  }

  .profile-link:hover {
    opacity: 0.7;
  }

  :root {
    --background-color: #2b2632;
    --gradient-start: #d23d58;
    --gradient-end: #ffd53f;
    --transition-speed: 0.3s;
    --font: "Jockey One", sans-serif;
  }

  header {
    background: #2b2632;
    padding: 1rem 2%;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
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
    background-color: #3c3845; /* slightly different background for emphasis */
    padding: 10px 20px;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
    width: 100%;
    justify-content: space-between; /* for better distribution on mobile */
  }

  .signedInStatus:hover {
    background-color: #453e4d; /* subtle hover effect */
  }

  .avatar {
    border-radius: 50%;
    height: 2.8rem;
    width: 2.8rem;
    background-color: white;
    background-size: cover;
    background-repeat: no-repeat;
    margin-right: 0.5rem;
    border: 2px solid #e7e7e7; /* added border for more emphasis */
  }

  .signedInText {
    display: flex;
    flex-direction: column; /* stack text vertically */
    align-items: flex-start; /* align to the start */
  }

  .loaded {
    display: flex;
    align-items: center;
    gap: 1rem;
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
    color: #c9c9c9;
    padding: 0.5rem 1.5rem;
    border-radius: 0.3rem;
    font-size: 1.7em;
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
    padding: 8px 15px; /* slightly reduced for better fit */
    font-size: 0.9em; /* slightly reduced for better fit */
    background-color: #333;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    outline: none;
    margin-top: 0; /* remove the top margin */
    margin-left: 15px; /* space between the text and button */
  }

  .sign-out-button:hover {
    background-color: #555;
  }

  /* Media Query for larger screens */
  @media screen and (min-width: 768px) {
    .signedInStatus {
      width: auto; /* let it adjust based on content */
      justify-content: initial; /* revert to initial setting */
    }
  }

  /* Media Query for mobile screens */
  @media screen and (max-width: 768px) {
    header {
      flex-direction: column-reverse; /* Adjust for mobile */
    }

    .signedInStatus {
      order: 2; /* Adjust for mobile */
    }

    nav {
      order: 1; /* Adjust for mobile */
    }

    .navItems {
      flex-direction: row; /* Adjust for mobile */
    }

    .navItem {
      margin: 10px 0; /* Adjust for mobile */
    }

    .navItem a {
      text-align: center; /* Adjust for mobile */
      display: block; /* Adjust for mobile */
      width: 100%; /* Adjust for mobile */
    }
  }
</style>
