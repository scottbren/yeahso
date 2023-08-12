<script>
  import { onMount } from 'svelte';
  export let topicId; 

  let topic = "Default Topic";
  let itemsAgree = [];
  let itemsDisagree = [];

  onMount(async () => {
    // Fetch topic details
    console.log("Received topicId:", topicId);

    const topicResponse = await fetch(`/api/topics/${topicId}`);
    if (!topicResponse.ok) {
        console.error("Error fetching topic:", topicResponse.statusText);
        return;
    }
    const topicData = await topicResponse.json();
    console.log("Topic Data:", topicData);
    topic = topicData.title;

    // Fetch votes for the topic
    const votesResponse = await fetch(`/api/topics/${topicId}/votes`);
    if (!votesResponse.ok) {
        console.error("Error fetching votes:", votesResponse.statusText);
        return;
    }
    const votesData = await votesResponse.json();

    // Extract unique user IDs from the votes
    const userIds = [...new Set(votesData.map(vote => vote.userId))];

    // Fetch user details for all the user IDs
    const usersResponse = await fetch(`/api/users?ids=${userIds.join(",")}`);
    const usersData = await usersResponse.json();

    // Create a mapping of userId to user details for easy lookup
    const userIdToUserDetailsMap = usersData.reduce((acc, user) => {
        acc[user._id] = {
            username: user.username,
            profilePicture: user.profilePicture
        };
        return acc;
    }, {});
    // Split votes into agree and disagree using the detailed map
    itemsAgree = votesData
        .filter(vote => vote.vote === 'agree')
        .map(vote => userIdToUserDetailsMap[vote.userId]);
    itemsDisagree = votesData
        .filter(vote => vote.vote === 'disagree')
        .map(vote => userIdToUserDetailsMap[vote.userId]);

    });
</script>
  
<div class="swiper">
    <div class="topic-card">
        <p>{topic}</p>
    </div>
    <div class="columns-container">
        <div class="disagree-column column">
            <h3>Disagree</h3>
            {#each itemsDisagree as user}
            <div class="card">
              <img src="{user.profilePicture}" alt="{user.username}'s profile picture" class="profile-pic" />
              <p>{user.username}</p>
            </div>
          {/each}
          
        </div>
        <div class="agree-column column">
            <h3>Agree</h3>
            {#each itemsAgree as user}
            <div class="card">
              <img src="{user.profilePicture}" alt="{user.username}'s profile picture" class="profile-pic" />
              <p>{user.username}</p>
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

.swiper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    padding: 60px 0;
}

.topic-card {
    width: 80%;
    max-width: 800px;
    height: 200px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    color: var(--light);
    background: var(--gradient);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.topic-card:hover {
    transform: translateY(-10px);
}

.columns-container {
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

.profile-pic {
  width: 50px; /* or any desired size */
  height: 50px;
  border-radius: 50%; /* makes the image circular */
  margin-right: 10px; /* spacing between the image and the username */
  object-fit: cover; /* ensures the image covers the entire space without distortion */
}

</style>
