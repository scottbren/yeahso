<script>
  import { onMount } from 'svelte';
  export let topicId; 

  let topic = "Default Topic";
  let itemsAgree = [];
  let itemsDisagree = [];

        // Function to generate random values
        function getRandomValue(min, max) {
        return Math.random() * (max - min) + min;
    }
    function generateRandomBinary(length) {
        let binaryString = '';
        for (let i = 0; i < length; i++) {
        binaryString += Math.random() < 0.5 ? '0' : '1';
        }
        return binaryString;
    }


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
            userId: user._id,  // <-- Added this
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

<div class="matrix">
    {#each Array.from({ length: 1000 }) as _, index}
        <div class="matrix-line" style="top: {getRandomValue(0, 100)}%">
            {generateRandomBinary(1000)} <!-- Longer binary strings -->
        </div>
    {/each}
</div>
  
<div class="swiper">
    <div class="topic-card">
        <p>{topic}</p>
    </div>
    <div class="columns-container">
        <div class="disagree-column column">
            <h3>Disagree</h3>
            {#each itemsDisagree as user (user.userId)}  <!-- Using user.userId as a key -->
            <a href="/profile/{user.userId}"> 
                <div class="card">
                    <img src="{user.profilePicture}" alt="{user.username}'s profile picture" class="profile-pic" />
                    <p>{user.username}</p>
                </div>
            </a>
        {/each}
        </div>
        
        <div class="agree-column column">
            <h3>Agree</h3>
            {#each itemsAgree as user (user.userId)}  <!-- Using user.userId as a key -->
            <a href="/profile/{user.userId}">
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
        --card-bg-gradient: linear-gradient(135deg, #21f034);
        --secondary-color: #000;
        --neutral-dark: #333;
        --neutral-light: #aaa;
        --font: 'Courier New', Courier, monospace;
        --neon-green: #21f034;
        --neon-orange: #ff6b6b;
    }
    
    body {
        font-family: var(--font);
        background: var(--secondary-color);
        color: var(--neon-green);
    }
    
    .swiper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 40px;
        padding: 60px 0;
        background: rgba(0, 0, 0, 0.7); /* 80% opaque so that matrix effect is visible behind */
        background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px);
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
        color: white;
        background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px), var(--card-bg-gradient);
        box-shadow: 0 0 10px var(--neon-green), 0 0 30px var(--neon-green);
        transition: transform 0.3s;
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
        overflow-y: auto; /* Add scrolling if content overflows vertically */
        max-height: 500px; /* Adjust to your preference */
    }
    
    h3 {
        display: flex;
        justify-content: center;
        font-size: 1.6em;
        color: var(--light);
        border-bottom: 2px solid var(--neon-green);
        padding-bottom: 10px;
    }
    
    .card {
        padding: 20px;
        background: var(--neutral-light);
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
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
        object-fit: cover;
    }

    /* MATRIX EFFECT STYLES */
    .matrix {
        position: absolute;
        left: 0;
        width: 100vw;
        height: 100vh;
        color: var(--neon-green);
        z-index: -1; /* Make it sit behind your content */
        animation: matrixFall 5s linear infinite;

    }

    .matrix .matrix-line {
        animation: matrixFall infinite; /* Ensure it keeps looping */
    }

    @keyframes matrixFall {
    0% {
        transform: translateY(-100%);
    }
    100% {
        transform: translateY(0%);
    }
}
    </style>
