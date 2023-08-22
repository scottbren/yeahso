<script context="module">
  export async function load({ session }) {
    return {
      props: {
        user: session.user,
      },
    }
  }
</script>

<script>
  import { onMount } from "svelte"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"

  export let user

  let id = user?.twitterId
  let topics = []
  let currentTopic = null
  let itemsAgree = []
  let itemsDisagree = []
  let currentCardIndex = 0

  onMount(async () => {
    try {
      console.log("userId: ", id)
      const topicsResponse = await fetch(`/api/topics`)
      const userVotesResponse = await fetch(`/api/users/${id}/votes`)

      if (!topicsResponse.ok || !userVotesResponse.ok) {
        throw new Error("Error fetching data")
      }

      const allTopics = await topicsResponse.json()
      let userVotes = await userVotesResponse.json()
      userVotes = userVotes.votes
      console.log("uservotes in swipe: ", userVotes)

      // Filter out topics the user has already voted on
      topics = allTopics.filter(
        (topic) => !userVotes.some((vote) => vote.topicId === topic._id)
      )
      console.log("All topics:", allTopics)
      console.log("User's votes:", userVotes)
      console.log("Filtered topics:", topics)

      if (topics.length > 0) {
        await loadCurrentTopicData()
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  })

  function navigateToUserProfile(userId) {
    goto(`/profile/${userId}`)
  }

  async function loadCurrentTopicData() {
    currentTopic = topics[currentCardIndex]

    const [votesResponse, usersResponse] = await Promise.all([
      fetch(`/api/topics/${currentTopic._id}/votes`),
      fetch(`/api/users`),
    ])

    const votesData = await votesResponse.json()
    const userIds = [...new Set(votesData.votes.map((vote) => vote.userId))]
    const usersData = await usersResponse.json()
    const userIdToUserMap = usersData.reduce((acc, user) => {
      const idToUse = user.twitterId || user._id
      acc[idToUse] = user
      return acc
    }, {})

    itemsAgree = votesData.votes
      .filter((vote) => vote.vote === "agree")
      .map((vote) => {
        if (!userIdToUserMap[vote.userId]) {
          console.warn("Missing user data for userId:", vote.userId)
          return null
        }
        return userIdToUserMap[vote.userId]
      })
      .filter(Boolean)

    itemsDisagree = votesData.votes
      .filter((vote) => vote.vote === "disagree")
      .map((vote) => {
        if (!userIdToUserMap[vote.userId]) {
          console.warn("Missing user data for userId:", vote.userId)
          return null
        }
        return userIdToUserMap[vote.userId]
      })
      .filter(Boolean)

    topics = topics.filter((topic) => topic._id !== currentTopic._id)

    if (!topics.length) {
      console.log("No more topics to vote on.")
      currentTopic = null // hide the current topic card
    }
  }

  async function registerVote(voteType) {
    if (!currentTopic || !$page.data.session.user) return

    const timestamp = new Date().toISOString() // Capture the current timestamp

    const response = await fetch(`/api/topics/${currentTopic._id}/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topicId: currentTopic._id,
        userId: id,
        vote: voteType,
        timestamp: timestamp, // Include the timestamp in the body
      }),
    })

    if (response.ok) {
      console.log("Vote registered successfully")
    } else {
      console.error("Error registering vote", await response.text())
    }
  }

  function transitionCard(direction) {
    cardTransition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
    cardOffset = direction === "left" ? -window.innerWidth : window.innerWidth
    setTimeout(() => {
      currentCardIndex++
      if (currentCardIndex >= topics.length) {
        currentCardIndex = 0
      }
      cardOffset = 0
      cardTransition = ""
      currentCardIndex++
      if (currentCardIndex < topics.length) {
        loadCurrentTopicData()
      } else {
        currentTopic = null
        console.log("No more topics to vote on.")
      }
    }, 500)
  }

  async function swipeLeft() {
    await registerVote("disagree")
    transitionCard("left")
  }

  async function swipeRight() {
    await registerVote("agree")
    transitionCard("right")
  }

  let cardOffset = 0
  let cardTransition = ""
</script>

<div class="swiper">
  {#if currentTopic}
    <div
      class="topic-card"
      style="transform: translateX({cardOffset}px) rotateY({cardOffset /
        20}deg); transition: {cardTransition};"
    >
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
      <div class="agree-column column">
        <h3>Agree</h3>
        {#each itemsAgree as item (item._id)}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="user-container"
            on:click={() => navigateToUserProfile(item.twitterId)}
          >
            <img
              class="profile-pic"
              src={item.profileImageUrl}
              alt="user-avatar"
            />
            <span>{item.username}</span>
          </div>
        {/each}
      </div>

      <div class="disagree-column column">
        <h3>Disagree</h3>
        {#each itemsDisagree as item (item._id)}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="user-container"
            on:click={() => navigateToUserProfile(item.twitterId)}
          >
            <img
              class="profile-pic"
              src={item.profileImageUrl}
              alt="user-avatar"
            />
            <span>{item.username}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  :root {
    --background-color: #2b2632;
    --gradient-start: #d23d58;
    --gradient-end: #ffd53f;
    --transition-speed: 0.3s;
    --font: "Jockey One", sans-serif;
  }

  body,
  h1,
  p,
  button {
    font-family: var(--font);
    margin: 0;
    padding: 0;
  }

  body {
    background-color: var(--background-color);
    background-image: radial-gradient(
      circle at top left,
      rgba(255, 255, 255, 0.05),
      transparent
    ); /* Slight background texture */
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
    background: linear-gradient(
      to right,
      var(--gradient-start),
      var(--gradient-end)
    );
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    margin-bottom: 15px;
    height: 450px;
    padding-top: 40px;
    font-size: 60px;
    color: #c9c9c9;
    text-align: center;
  }

  .buttons-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .disagree-button,
  .agree-button {
    width: 50%; /* Reduced width from 50% */
    background: rgba(217, 217, 217, 0.5);
    padding-top: 10px; /* Reduced padding from 30px */
    padding-bottom: 10px; /* Reduced padding from 30px */
    font-size: 60px; /* Reduced font size from 80px */
  }

  button {
    padding: 15px 35px;
    font-size: 1.1rem;
    background: var(--background-color);
    color: var(--gradient-start);
    border: none;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    transition: transform var(--transition-speed),
      box-shadow var(--transition-speed);
    outline: none;
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); /* Intensified shadow on hover */
  }

  .columns-container {
    display: flex;
    flex-direction: column; /* changed to column to stack child elements vertically */
    justify-content: space-between;
    width: 650px;
    background: #3c3c3c;
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

  .column h3 {
    font-size: 1.5em;
    margin-bottom: 30px;
    color: var(--gradient-start);
  }

  .user-container {
    display: flex;
    align-items: center; /* Vertically align children */
    gap: 10px; /* Spacing between image and text */
    padding: 10px 20px; /* Adjusted padding for a better look */
    background: var(--background-color);
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    font-size: 1.2em;
    transition: transform 0.3s, box-shadow 0.3s;
    color: var(--gradient-start);
    cursor: pointer; /* Change cursor to hand on hover for better interactivity */
    max-width: 100%;
    min-width: 100%;
  }

  .user-container span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px; /* Adjust as needed for your design */
  }

  .user-container:hover {
    transform: translateY(-5px); /* A subtle move up on hover */
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2); /* More prominent shadow on hover */
  }

  .profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }

  /* Media Queries for Mobile Optimization */
  @media screen and (max-width: 768px) {
    .swiper {
      padding: 10px; /* Some padding to ensure elements don't touch screen edges */
    }

    .topic-card {
      width: 100%; /* Make the card take the full width */
      min-height: 60vh; /* Set a minimum height for the card */
      padding: 20px 30px; /* Increase padding for better spacing */
      font-size: 50px; /* Make the font bigger */
      margin-bottom: 30px; /* Increase space below the card */
      display: flex;
      flex-direction: column;
      justify-content: space-around; /* Center content vertically */
      align-items: center; /* Center content horizontally */
      text-align: center; /* Centering the text */
    }

    .buttons-container {
      width: 100%; /* Ensuring it takes the full width of the card */
      display: flex;
      justify-content: space-between; /* Space out the buttons */
    }

    .disagree-button,
    .agree-button {
      width: 48%; /* To ensure there's some gap in between */
      font-size: 50px; /* Bigger icons for better touch */
      padding: 20px 0; /* Adjusted padding */
    }

    .columns-container {
      width: 100%; /* Making it responsive */
      padding: 15px; /* Adjusted padding */
    }

    .column {
      width: 48%; /* To ensure there's some gap in between */
    }

    .column h3 {
      font-size: 1.3em; /* Adjust font size */
      margin-bottom: 20px; /* Adjusted margin */
    }

    .user-container {
      gap: 5px; /* reduce gap for more space */
      padding: 10px 15px; /* reduce padding for more space */
      max-width: 100%; /* Adjusted for mobile */
      min-width: 100%;
    }

    .user-container span {
      font-size: 0.5em; /* Slightly reduce font size */
    }

    .profile-pic {
      width: 40px;
      height: 40px; /* Adjusting the image sizes */
      margin-right: 5px; /* Reduced margin */
    }
  }
</style>
