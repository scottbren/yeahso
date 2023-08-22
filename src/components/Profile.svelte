<script context="module">
  export async function load({ params }) {
    return { props: { userId: params.userId } }
  }
</script>

<script>
  import { onMount } from "svelte"
  export let userId

  let user = {}
  let disagreements = []
  let agreements = []

  onMount(async () => {
    try {
      const userVotesResponse = await fetch(`/api/users/${userId}/votes`)
      if (!userVotesResponse.ok)
        throw new Error(`Error fetching votes: ${userVotesResponse.statusText}`)
      const data = await userVotesResponse.json()
      console.log(data)
      user = data?.user || {}
      console.log("profile user", user)
      console.log(data.votes)
      for (const vote of data.votes) {
        const topicResponse = await fetch(`/api/topics/${vote.topicId}`)
        if (!topicResponse.ok)
          throw new Error(`Error fetching topic: ${topicResponse.statusText}`)
        const topicDetails = await topicResponse.json()

        if (vote.vote === "disagree") {
          disagreements = [...disagreements, { ...topicDetails, ...vote }]
        } else {
          agreements = [...agreements, { ...topicDetails, ...vote }]
          console.log(agreements)
        }
      }
    } catch (err) {
      console.error("Error:", err.message)
    }
  })

  async function changeVote(topicId, newVote) {
    console.log("changeVote function called, ", topicId) // For debugging
    try {
      console.log("changeVote function called, ", topicId) // For debugging
      console.log("topicId in profile: ", topicId)
      console.log("userId in profile: ", userId)

      console.log("Sending request with body:", {
        userId,
        vote: newVote,
      })

      const response = await fetch(`/api/votes/${topicId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId,
          vote: newVote,
        }),
      })

      if (response.ok) {
        console.log("Vote changed successfully")
        location.reload()
      } else {
        console.error("Error changing vote", await response.text())
      }
    } catch (err) {
      console.error("Error:", err.message)
    }
  }
</script>

<div class="profile">
  <div class="profile-header">
    <div class="profile-picture">
      <img src={user.profileImageUrl} alt="Profile" />
    </div>
    <h2>{user.username}</h2>
  </div>
  <div class="profile-content">
    <div class="column">
      <h3>Agree</h3>
      {#each agreements as agreement}
        <div class="card">
          <p>{agreement.title}</p>
          {#if user.twitterId === userId}
            <!-- Check if the user is viewing their own profile -->
            <button on:click={() => changeVote(agreement._id, "disagree")}>
              Change to Disagree
            </button>
          {/if}
        </div>
      {/each}
    </div>
    <div class="column">
      <h3>Disagree</h3>
      {#each disagreements as disagreement}
        <div class="card">
          <p>{disagreement.title}</p>
          {#if user.twitterId === userId}
            <!-- Check if the user is viewing their own profile -->
            <button on:click={() => changeVote(disagreement._id, "agree")}>
              Change to Agree
            </button>
          {/if}
        </div>
      {/each}
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

  body {
    font-family: var(--font);
    background-color: var(--background-color);
    margin: 0;
    padding: 0;
  }

  .profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    padding: 60px 0;
    background: var(--background-color);
  }

  .profile-header {
    background: linear-gradient(
      to right,
      var(--gradient-start),
      var(--gradient-end)
    );
    padding: 30px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    display: flex; /* Making this a flex container */
    flex-direction: column; /* Stack children vertically */
    justify-content: center; /* Center children vertically */
    align-items: center; /* Center children horizontally */
  }

  .profile-picture {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }

  .profile-picture img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h2,
  h3 {
    font-size: 2em;
    color: #c9c9c9;
    margin: 0;
    font-family: var(--font);
  }

  .profile-content {
    display: flex;
    gap: 50px;
    width: 90%;
    max-width: 1100px;
    background: var(--background-color);
    padding: 20px;
    border-radius: 10px;
  }

  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  h3 {
    font-size: 1.6em;
    border-bottom: 2px solid var(--gradient-start);
    padding-bottom: 10px;
    margin-bottom: 20px;
    width: 100%;
    text-align: left;
  }

  .card {
    background: #191716;
    padding: 15px 25px;
    border-radius: 10px;
    width: 100%;
    transition: transform var(--transition-speed);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  }

  .card:hover {
    transform: translateY(-5px);
  }

  .card p {
    margin: 0;
    color: #c9c9c9;
  }

  .card button {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: var(--gradient-start);
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }

  .card button:hover {
    background-color: var(--gradient-end);
    transform: translateY(-2px);
  }

  .card button:active {
    transform: translateY(0);
  }

  @media screen and (max-width: 768px) {
    .profile {
      gap: 30px;
      padding: 40px 10px; /* Reduced padding */
    }

    .profile-header {
      padding: 20px;
      border-radius: 15px;
    }

    .profile-picture {
      width: 100px;
      height: 100px;
      margin-bottom: 10px;
    }

    h2,
    h3 {
      font-size: 1.4em; /* Reduce the font size */
    }

    .profile-content {
      flex-direction: column; /* Stack columns vertically */
      gap: 30px;
    }

    .column {
      width: 100%;
    }

    h3 {
      font-size: 1.4em;
      text-align: center;
    }

    .card {
      padding: 10px 15px; /* Reduced padding */
    }
  }
</style>
