<script context="module">
    export async function load({ params }) {
        console.log("Params:", params);  // Debug
        return { props: { userId: params.userId } };
    }
</script>

<script>
    import { onMount } from 'svelte';
    export let userId;

    let user = {};
    let disagreements = [];
    let agreements = [];

    onMount(async () => {
        try {
            const userResponse = await fetch(`/api/users/${userId}`);
            if (!userResponse.ok) throw new Error(`Error fetching user: ${userResponse.statusText}`);
            user = await userResponse.json();

            // Use the new endpoint for votes
            const userVotesResponse = await fetch(`/api/users/${userId}/votes`);
            if (!userVotesResponse.ok) throw new Error(`Error fetching votes: ${userVotesResponse.statusText}`);
            const userVotes = await userVotesResponse.json();
            
            // Fetch topic details for each user vote and populate the arrays
            for (const vote of userVotes) {
                const topicResponse = await fetch(`/api/topics/${vote.topicId}`);
                if (!topicResponse.ok) throw new Error(`Error fetching topic: ${topicResponse.statusText}`);
                const topicDetails = await topicResponse.json();

                if (vote.vote === 'disagree') {
                    disagreements = [...disagreements, {...topicDetails, ...vote}];
                } else {
                    agreements = [...agreements, {...topicDetails, ...vote}];
                }
            }
            console.log("User data:", user);
            console.log("Disagreements:", disagreements);
            console.log("Agreements:", agreements);

        } catch (err) {
            console.error("Error:", err.message);
        }
    });


</script>








<div class="profile">
  <div class="profile-header">
      <div class="profile-picture">
          <img src={user.profilePicture} alt="Profile" />
      </div>
      <h2>{user.username}</h2>
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
        --gradient: linear-gradient(135deg, #21f034);
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
        margin: 0;
        padding: 0;
    }
    
    .profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 50px;
        padding: 60px 0;
        background: var(--secondary-color);
        background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px);
    }
    
    .profile-header {
        background: var(--gradient);
        padding: 30px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 0 10px var(--neon-green), 0 0 30px var(--neon-green);
    }
    
    .profile-picture {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 20px;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-green), 0 0 30px var(--neon-green);
    }
    
    .profile-picture img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    h2, h3 {
        font-size: 2em;
        color: var(--neon-green);
        margin: 0;
        font-family: var(--font);
    }
    
    .profile-content {
        display: flex;
        gap: 50px;
        width: 90%;
        max-width: 1100px;
        background: var(--neutral-dark);
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
        border-bottom: 2px solid var(--neon-green);
        padding-bottom: 10px;
    }
    
    .card {
        padding: 20px;
        background: var(--neutral-dark);
        border-radius: 20px;
        box-shadow: 0 0 10px var(--neon-green), 0 0 30px var(--neon-green);
        font-size: 1.2em;
        transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    }
    
    @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    </style>
    
