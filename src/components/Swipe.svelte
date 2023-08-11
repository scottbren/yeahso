<script>
  import { goto } from '$app/navigation';
  
  let topics = [
    "Cats are better than dogs",
    "Pineapple belongs on pizza",
    "Winter is better than summer",
    "Coffee is better than tea"
  ];
  
  let itemsAgree = ["User1", "User3", "User5"];
  let itemsDisagree = ["User2", "User4"];
  let currentCardIndex = 0;
  
  let start = null;
  let cardOffset = 0;
  let cardTransition = "";
  let dragging = false;
  
  function navigateToDetails(topic) {
    goto(`/details/${encodeURIComponent(topic)}`);
  }

function swipeLeft() {
    cardTransition = "transform 0.5s ease-out";
    cardOffset = -window.innerWidth;
    setTimeout(() => {
        if (currentCardIndex < topics.length - 1) {
            currentCardIndex++;
        }
        cardOffset = 0;
        cardTransition = "";
    }, 500);
}

function swipeRight() {
    cardTransition = "transform 0.5s ease-out";
    cardOffset = window.innerWidth;
    setTimeout(() => {
        if (currentCardIndex < topics.length - 1) {
            currentCardIndex++;
        }
        cardOffset = 0;
        cardTransition = "";
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
    {#each topics as topic, index}
    {#if index === currentCardIndex}
    <div class="topic-card"
         style="transform: translateX({cardOffset}px) rotateY({cardOffset / 20}deg); transition: {cardTransition};"
         on:mousedown={startSwipe}
         on:mousemove={swipe}
         on:mouseup={endSwipe}
    >
        <p>{topic}</p>
        <div class="buttons-container">
            <button class="disagree-button" on:click={swipeLeft}>Disagree</button>
            <button class="details-button" on:click={() => navigateToDetails(topic)}>Details</button>
            <button class="agree-button" on:click={swipeRight}>Agree</button>
        </div>
    </div>
    {/if}
    {/each}
    <div class="columns-container">
      <div class="disagree-column column">
        <h3>Disagree</h3>
        {#each itemsDisagree as user}
          <img src="https://i.pravatar.cc/150?img=1" alt="{user} profile picture" class="profile-pic"/>
        {/each}
      </div>
      <div class="agree-column column">
        <h3>Agree</h3>
        {#each itemsAgree as user}
          <img src="https://i.pravatar.cc/150?img=2" alt="{user} profile picture" class="profile-pic"/>
        {/each}
      </div>
    </div>
  </div>
  
  
  <style>:root {
    --main-bg-color: rgb(54, 54, 54);
    --container-width: 600px;
    --card-width: 250px;
    --card-bg-gradient: linear-gradient(to bottom right, red, orange);
  }
  
  .swiper {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh; 
    overflow: hidden; 
    padding: 0;
    margin: 0;
  }
  
  .topic-card {
    width: var(--container-width);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: 1.5em;
    background: var(--card-bg-gradient);
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    margin-bottom: 20px;
    padding: 20px;
    height: 750px;
    transform-origin: center center;
  }
  
  .topic-card:hover {
    transform: translateY(-5px);
  }
  
  .buttons-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
    gap: 10px;
  }
  
  .disagree-button, .agree-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    cursor: pointer;
    outline: none;
    transition: background 0.3s, transform 0.2s;
  }
  
  .disagree-button {
    background-color: red;
    color: white;
  }
  
  .agree-button {
    background-color: green;
    color: white;
  }
  
  .disagree-button:hover, .agree-button:hover {
    background-color: #cc0000; 
    transform: translateY(-2px);
  }
  
  .columns-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: var(--container-width);
    height: calc(100vh - 270px);
    background-color: var(--main-bg-color);
    padding: 20px;
    border-radius: 10px;
  }
  
  .column {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: var(--card-width);
    align-items: center;
  }
  
  .column h3 {
    font-size: 1.3em;
    margin-bottom: 20px;
  }
  
  .profile-pic {
    width: 40px; 
    height: 40px; 
    border-radius: 50%;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }

  
  .details-button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      font-size: 1em;
      cursor: pointer;
      background-color: #007BFF; /* Example blue color */
      color: white;
      transition: background 0.3s, transform 0.2s;
  }

  .details-button:hover {
      background-color: #0056b3; /* Darker blue on hover */
      transform: translateY(-2px);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  
  </style>
  