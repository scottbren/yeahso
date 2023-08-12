<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let topics = [];
    let currentTopic = null;
    let itemsAgree = [];
    let itemsDisagree = [];
    let currentCardIndex = 0;

    $: if (currentCardIndex !== null && topics.length) {
        loadCurrentTopicData();
    }

    onMount(async () => {
        const response = await fetch('/api/topics');
        topics = await response.json();
        if (topics.length > 0) {
            loadCurrentTopicData();
        }
    });

    async function loadCurrentTopicData() {
        currentTopic = topics[currentCardIndex];
        
        const votesResponse = await fetch(`/api/topics/${currentTopic._id}/votes`);
        const votesData = await votesResponse.json();
        const userIds = [...new Set(votesData.map(vote => vote.userId))];

        const usersResponse = await fetch(`/api/users?ids=${userIds.join(",")}`);
        const usersData = await usersResponse.json();

        const userIdToUserMap = usersData.reduce((acc, user) => {
            acc[user._id] = user;
            return acc;
        }, {});

        itemsAgree = votesData.filter(vote => vote.vote === 'agree').map(vote => userIdToUserMap[vote.userId]);
        itemsDisagree = votesData.filter(vote => vote.vote === 'disagree').map(vote => userIdToUserMap[vote.userId]);
    }
    
  let start = null;
  let cardOffset = 0;
  let cardTransition = "";
  let dragging = false;
  
  function navigateToDetails(currentTopic) {
    goto(`/details/${currentTopic._id}`);
  }

  function swipeLeft() {
    console.log("swipeLeft triggered");
    cardTransition = "transform 0.5s ease-out";
    cardOffset = -window.innerWidth;
    setTimeout(() => {
        currentCardIndex++;
        console.log("Updated currentCardIndex after swipeLeft:", currentCardIndex);
    
        cardOffset = 0;
        cardTransition = "";
        loadCurrentTopicData();
    }, 500);
}

function swipeRight() {
    console.log("swipeRight triggered");
    cardTransition = "transform 0.5s ease-out";
    cardOffset = window.innerWidth;
    setTimeout(() => {
        currentCardIndex++;
        console.log("Updated currentCardIndex after swipeRight:", currentCardIndex);

        cardOffset = 0;
        cardTransition = "";
        loadCurrentTopicData();
    }, 500);
}



function startSwipe(event) {
    dragging = true;
    start = event.clientX;
    cardTransition = "";
}

function swipe(event) {
    if (!dragging) return;
    cardOffset = event.clientX - start;
}


function agreeAction() {
    swipeRight();
}

function disagreeAction() {
    swipeLeft();
}


function endSwipe() {
    dragging = false;

    const threshold = window.innerWidth / 3;

    if (cardOffset < -threshold) {
        swipeLeft();
    } else if (cardOffset > threshold) {
        swipeRight();
    } else {
        cardOffset = 0;
        cardTransition = "transform 0.5s ease-out";
    }
}



</script>
  
<div class="swiper">
    {#if currentTopic}
    <div class="topic-card"
         style="transform: translateX({cardOffset}px) rotateY({cardOffset / 20}deg); transition: {cardTransition};"
         on:mousedown={startSwipe}
         on:mousemove={swipe}
         on:mouseup={endSwipe}
    >
        <p>{currentTopic.title}</p>
        <div class="buttons-container">
            <button class="disagree-button" on:click={swipeLeft}>Disagree</button>
            <button class="details-button" on:click={() => navigateToDetails(currentTopic)}>Details</button>
            <button class="agree-button" on:click={swipeRight}>Agree</button>
        </div>
    </div>
    {/if}
    <div class="columns-container">
      <div class="disagree-column column">
        <h3>Disagree</h3>
        {#each itemsDisagree as user}
          <img src={user.profilePicture} alt="{user.username} profile picture" class="profile-pic"/>
        {/each}
      </div>
      <div class="agree-column column">
        <h3>Agree</h3>
        {#each itemsAgree as user}
          <img src={user.profilePicture} alt="{user.username} profile picture" class="profile-pic"/>
        {/each}
      </div>
    </div>
  </div>
  
  
  
  <style>
    :root {
        --card-bg-gradient: linear-gradient(135deg, #ff6b6b, #ffad5e);
        --secondary-color: #f5f7fa;
        --neutral-dark: #333;
        --neutral-light: #aaa;
        --font: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    body {
        font-family: var(--font);
        background: var(--secondary-color);
    }
    
    .swiper {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        overflow: hidden;
        padding: 0;
        margin: 0;
    }
    
    .topic-card {
        width: 650px;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        background: var(--card-bg-gradient);
        color: white;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s;
        margin-bottom: 15px;
        margin-top: 25px;
        padding: 40px 30px;
        height: 450px;
        font-size: 1.8em;
        transform-origin: center center;
    }
    
    .buttons-container {
        width: 100%;
        display: flex;
        justify-content: space-around;
        gap: 10px;
    }
    
    button {
        padding: 12px 24px;
        border: none;
        border-radius: 25px;
        font-size: 1.1em;
        cursor: pointer;
        outline: none;
        transition: background 0.3s, transform 0.2s, box-shadow 0.2s;
    }
    
    .disagree-button {
        background-color: #ff6b6b;
        color: white;
    }
    
    .agree-button {
        background-color: #ffad5e;
        color: white;
    }
    
    .details-button {
        background-color: var(--neutral-light);
        color: var(--neutral-dark);
    }
    
    button:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .columns-container {
        display: flex;
        justify-content: space-between;
        width: 650px;
        height: calc(100vh - 300px);
        background: var(--neutral-dark);
        padding: 20px;
        border-radius: 10px;
    }
    
    .column {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 275px;
        align-items: center;
    }
    
    .column h3 {
        font-size: 1.5em;
        margin-bottom: 30px;
        color: var(--neutral-light);
    }
    
    .profile-pic {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    }
    </style>