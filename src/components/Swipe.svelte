<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { session } from "../stores";
    import { page } from "$app/stores";

    let userId;
    if ($page.data.session) {
        userId = $page.data.session.user.id;
        console.log("swipe session", $page.data.session.user);
    }

    let topics = [];
    let currentTopic = null;
    let itemsAgree = [];
    let itemsDisagree = [];
    let currentCardIndex = 0;
 

    onMount(async () => {
        $page.data.session.user && (userId = $page.data.session.user.id);

        const topicsResponse = await fetch(`/api/topics`);
        topics = await topicsResponse.json();

        if (topics.length > 0) {
            await loadCurrentTopicData();
        }
    });

    function setCurrentTopic() {
        if (currentCardIndex !== null && currentCardIndex < topics.length) {
            currentTopic = topics[currentCardIndex];
        }
    }

    async function loadCurrentTopicData() {
        currentTopic = topics[currentCardIndex];

        const [votesResponse, usersResponse] = await Promise.all([
            fetch(`/api/topics/${currentTopic._id}/votes`),
            fetch(`/api/users`)
        ]);

        const votesData = await votesResponse.json();
        const userIds = [...new Set(votesData.votes.map(vote => vote.userId))];
        const usersData = await usersResponse.json();
        const userIdToUserMap = usersData.reduce((acc, user) => {
            const idToUse = user.twitterId || user._id;
            acc[idToUse] = user;
            return acc;
        }, {});

        itemsAgree = votesData.votes.filter(vote => vote.vote === 'agree').map(vote => {
            if (!userIdToUserMap[vote.userId]) {
                console.warn("Missing user data for userId:", vote.userId);
                return null;
            }
            return userIdToUserMap[vote.userId];
        }).filter(Boolean);

        itemsDisagree = votesData.votes.filter(vote => vote.vote === 'disagree').map(vote => {
            if (!userIdToUserMap[vote.userId]) {
                console.warn("Missing user data for userId:", vote.userId);
                return null;
            }
            return userIdToUserMap[vote.userId];
        }).filter(Boolean);

        topics = topics.filter(topic => topic._id !== currentTopic._id);
        
        if (!topics.length) {
            console.log("No more topics to vote on.");
            currentTopic = null;  // hide the current topic card
        }
    }

    async function registerVote(voteType) {
        if (!currentTopic || !$page.data.session.user) return;

        userId = $page.data.session.user.id;

        const response = await fetch(`/api/topics/${currentTopic._id}/votes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topicId: currentTopic._id,
                userId: userId,
                vote: voteType,
            })
        });

        if (response.ok) {
            console.log("Vote registered successfully");
        } else {
            console.error("Error registering vote", await response.text());
        }
    }


    function transitionCard(direction) {
        cardTransition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
        cardOffset = direction === 'left' ? -window.innerWidth : window.innerWidth;
        setTimeout(() => {
            currentCardIndex++;
            if (currentCardIndex >= topics.length) {
                currentCardIndex = 0; 
            }
            cardOffset = 0;
            cardTransition = "";
            currentCardIndex++;
            if (currentCardIndex < topics.length) {
                loadCurrentTopicData();
            } else {
                currentTopic = null;
                console.log("No more topics to vote on.");
            }
        }, 500);
    }

    async function swipeLeft() {
        await registerVote('disagree');
        transitionCard('left');
    }

    async function swipeRight() {
        await registerVote('agree');
        transitionCard('right');
    }

    
    let cardOffset = 0;
    let cardTransition = "";
</script>

<div class="swiper">
    {#if currentTopic}
    <div class="topic-card" style="transform: translateX({cardOffset}px) rotateY({cardOffset / 20}deg); transition: {cardTransition};">      
        <p>{currentTopic.title}</p>
        <div class="buttons-container">
            <button class="disagree-button" on:click={swipeLeft}>❌</button>
            <button class="agree-button" on:click={swipeRight}>✅</button>
        </div>
    </div>
    {:else}
    <p>No new topics available for voting.</p>
    {/if}
    <div class="columns-container">
        <div class="column-container">
            <div class="disagree-column column">
                <h3>Disagree</h3>
                {#each itemsDisagree as item (item._id)}
                <div class="user">
                    <img src={item.profileImageUrl} alt="user-avatar" />
                    <p>{item.username}</p>
                </div>
                {/each}
            </div>
            <div class="agree-column column">
                <h3>Agree</h3>
                {#each itemsAgree as item (item._id)}
                <div class="user">
                    <img src={item.profileImageUrl} alt="user-avatar" />
                    <p>{item.username}</p>
                </div>
                {/each}
            </div>
        </div>
    </div>
</div>


  
  
  <style>
    :root {
        --background-color: #2B2632;
        --gradient-start: #D23D58;
        --gradient-end: #FFD53F;
        --transition-speed: 0.3s;
        --font: 'Jockey One', sans-serif;
    }
    
    body, h1, p, button {
        font-family: var(--font);
        margin: 0;
        padding: 0;
    }
    
    body {
        background-color: var(--background-color);
        background-image: radial-gradient(circle at top left, rgba(255,255,255,0.05), transparent); /* Slight background texture */
    }

    .swiper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow-x: hidden;
    }
    
    .topic-card {
        width: 650px;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        margin-top: 25px;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(to right, var(--gradient-start), var(--gradient-end));
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: transform 0.2s;
        margin-bottom: 15px;
        height: 450px;
        padding-top: 40px;
        font-size: 60px;
        color: #C9C9C9;
        text-align: center;  
    }
    
    .buttons-container {
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    
    .disagree-button, .agree-button {
        width: 50%;  
        background: rgba(217, 217, 217, 0.5);  
        padding-top: 30px;
        padding-bottom: 30px;
        font-size: 80px;
    }
        
    button {
        padding: 15px 35px;
        font-size: 1.1rem;
        background: var(--background-color);
        color: var(--gradient-start);
        border: none;
        border-radius: 30px;
        cursor: pointer;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        transition: transform var(--transition-speed), box-shadow var(--transition-speed);
        outline: none;
    }
    
    button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2); /* Intensified shadow on hover */
    }
    
    .columns-container {
    display: flex;
    flex-direction: column; /* changed to column to stack child elements vertically */
    justify-content: space-between;
    width: 650px;
    background: #3C3C3C;
    padding: 20px;
    border-radius: 10px;
    }

    .column-container {
        display: flex;
        justify-content: space-between;
        width: 100%; /* make the container take full width of the parent */
    }

    .column {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 275px;
        align-items: center;
    }

    .details-button {
        align-self: center; /* Center the button in the .columns-container */
        margin-top: 20px;  /* Add some top margin for spacing */
    }

    
    .column h3 {
        font-size: 1.5em;
        margin-bottom: 30px;
        color: var(--gradient-start);
    }
    
    .profile-pic {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .user-container {
      display: grid;  
      grid-template-columns: repeat(3, 1fr); 
      gap: 10px;
      align-items: center;
  }
    
    </style>
    