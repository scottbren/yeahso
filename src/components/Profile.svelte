<script>
  import { onMount } from 'svelte';
  
  let username;
  let profilePicture;
  let disagreements = [];
  let agreements = [];

  onMount(async () => {
    // Example endpoint to fetch user data by username
    const response = await fetch(`/api/users/${encodeURIComponent(username)}`);
    const userData = await response.json();

    username = userData.username;
    profilePicture = userData.profilePicture;

    // Example endpoints to fetch user's agreements and disagreements
    const agreementsResponse = await fetch(`/api/users/${encodeURIComponent(username)}/agreements`);
    agreements = await agreementsResponse.json();

    const disagreementsResponse = await fetch(`/api/users/${encodeURIComponent(username)}/disagreements`);
    disagreements = await disagreementsResponse.json();
  });
</script>


<div class="profile">
  <div class="profile-header">
      <div class="profile-picture">
          <img src={profilePicture} alt="Profile" />
      </div>
      <h2>{username}</h2>
  </div>
  <div class="profile-content">
      <div class="column">
          <h3>Disagreements</h3>
          {#each disagreements as disagreement}
              <div class="card">
                  <p>{disagreement.title}</p>
              </div>
          {/each}
      </div>
      <div class="column">
          <h3>Agreements</h3>
          {#each agreements as agreement}
              <div class="card">
                  <p>{agreement.title}</p>
              </div>
          {/each}
      </div>
  </div>
</div>

<style>
:root {
    --gradient: linear-gradient(135deg, #ff6b6b, #ffad5e);
    --neutral: #2a2a2a;
    --light: #f7f7f7;
    --font: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    font-family: var(--font);
    background: var(--light);
    margin: 0;
    padding: 0;
}

.profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    padding: 60px 0;
}

.profile-header {
    background: var(--gradient);
    padding: 30px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.profile-picture {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.profile-picture img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

h2 {
    font-size: 2em;
    color: var(--light);
    margin: 0;
}

.profile-content {
    display: flex;
    gap: 50px;
    width: 90%;
    max-width: 1100px;
}

.column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

h3 {
    display: flex;
    justify-content: center;
    font-size: 1.6em;
    color: var(--light);
    border-bottom: 2px solid var(--gradient);
    padding-bottom: 10px;
}

.card {
    padding: 20px;
    background: var(--light);
    border-radius: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    font-size: 1.2em;
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}
</style>
