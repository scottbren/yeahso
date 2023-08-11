<script>
  let username = 'John Doe';
  let profilePicture = 'https://i.pravatar.cc/150?img=3';
  let items = ['Item 1', 'Item 2', 'Item 3'];
</script>

<div class="profile">
  <div class="profile-info-container">
    <div class="profile-picture">
      <img src={profilePicture} alt="Profile" />
    </div>
    <div class="profile-info">
      <h2>{username}</h2>
    </div>
  </div>
  <div class="profile-container">
    <div class="disagree-column">
      {#each items as item}
        <div class="card red-orange-gradient">
          <p>{item}</p>
        </div>
      {/each}
    </div>
    <div class="agree-column">
      {#each items as item}
        <div class="card red-orange-gradient">
          <p>{item}</p>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  :root {
    --main-bg-color: rgba(20, 18, 18, 0.719);
    --profile-container-width: 600px;
    --card-width: 200px;
    --card-bg-gradient: linear-gradient(to bottom right, red, orange);
  }

  .profile {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px; /* Provides consistent spacing between child elements */
  }

  .profile-info-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    width: var(--profile-container-width);
  }

  .profile-picture {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
  }

  .profile-picture img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-info h2 {
    font-weight: bold;
    font-size: 1.5em;
    color: var(--card-bg-gradient);
  }

  .profile-container {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    gap: 20px;
    padding: 20px;
    border-radius: 10px;
    background-color: var(--main-bg-color);
    width: var(--profile-container-width);
    min-height: 600px;
  }

  .disagree-column, .agree-column {
    display: flex;
    flex-direction: column;
    gap: 10px; /* Adds spacing between cards */
  }

  .card {
    width: var(--card-width);
    border-radius: 25px;
    padding: 10px;
    background: var(--card-bg-gradient);
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Adds a subtle shadow to the cards */
    transition: transform 0.2s; /* Adds a subtle animation for hover effect */
  }

  .card:hover {
    transform: translateY(-5px); /* Lifts the card slightly on hover */
  }
</style>


