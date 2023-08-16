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
    const { votes, users } = await votesResponse.json();

    // Create a mapping of userId to user details for easy lookup
    const userIdToUserDetailsMap = users.reduce((acc, user) => {
        acc[user._id] = user;
        return acc;
    }, {});

    // Split votes into agree and disagree using the detailed map
    itemsAgree = votes
        .filter(vote => vote.vote === 'agree')
        .map(vote => userIdToUserDetailsMap[vote.userId]);
    itemsDisagree = votes
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
            {#each itemsDisagree as user (user._id)}
            <a href="/profile/{user._id}"> 
                <div class="card">
                    <img src="{user.profilePicture}" alt="{user.username}'s profile picture" class="profile-pic" />
                    <p>{user.username}</p>
                </div>
            </a>
        {/each}
        </div>
        
        <div class="agree-column column">
            <h3>Agree</h3>
            {#each itemsAgree as user (user._id)}
            <a href="/profile/{user._id}">
                <div class="card">
                    <img src="{user.profilePicture}" alt="{user.username}'s profile picture" class="profile-pic" />
                    <p>{user.username}</p>
                </div>
            </a>
        {/each}
        </div>
    </div>
</div>
  
<style>
    :root {
        --background-color: #2B2632;
        --gradient-start: #D23D58;
        --gradient-end: #FFD53F;
        --transition-speed: 0.3s;
    }
    
    body, h1, p, a, div {
        font-family: 'Jockey One', sans-serif; /* Updated the font */
        margin: 0;
        padding: 0;
    }
    
    body {
        background-color: var(--background-color);
        background-image: radial-gradient(circle at top left, rgba(255,255,255,0.05), transparent);
    }
    
    .swiper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 40px;
        padding: 60px 0;
        background: #3C3C3C;
        color: var(--background-color);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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
        color: var(--background-color);
        background: linear-gradient(to right, var(--gradient-start), var(--gradient-end));
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        margin-bottom: 15px;
        margin-top: 25px;
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
        overflow-y: auto;
        max-height: 500px;
    }
    
    h3 {
        display: flex;
        justify-content: center;
        font-size: 1.6em;
        color: var(--background-color);
        border-bottom: 2px solid var(--gradient-start);
        padding-bottom: 10px;
    }
    
    .card {
        padding: 20px;
        background: var(--background-color);
        border-radius: 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        font-size: 1.2em;
        transition: transform 0.3s, box-shadow 0.3s;
        color: var(--gradient-start);  /* Adjusting color for better contrast */
    }
    
    .card:hover {
        transform: translateY(-10px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .profile-pic {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
        object-fit: cover;
    }
</style>
