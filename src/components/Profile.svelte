<script context="module">
    export async function load({ params }) {
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
            const userVotesResponse = await fetch(`/api/users/${userId}/votes`);
            if (!userVotesResponse.ok) throw new Error(`Error fetching votes: ${userVotesResponse.statusText}`);
            const data = await userVotesResponse.json();
            console.log(data)
            user = data?.user || {};
            console.log("profile user", user)
            
            for (const vote of data.votes) {
                const topicResponse = await fetch(`/api/topics/${vote.topicId}`);
                if (!topicResponse.ok) throw new Error(`Error fetching topic: ${topicResponse.statusText}`);
                const topicDetails = await topicResponse.json();

                if (vote.vote === 'disagree') {
                    disagreements = [...disagreements, {...topicDetails, ...vote}];
                } else {
                    agreements = [...agreements, {...topicDetails, ...vote}];
                }
            }

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
        --background-color: #2B2632;
        --gradient-start: #D23D58;
        --gradient-end: #FFD53F;
        --transition-speed: 0.3s;
        --font: 'Jockey One', sans-serif;
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
        background: linear-gradient(to right, var(--gradient-start), var(--gradient-end));
        padding: 30px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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
    
    h2, h3 {
        font-size: 2em;
        color: #C9C9C9;
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
        color: #C9C9C9;
    }
</style>
