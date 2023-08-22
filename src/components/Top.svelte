<script>
  import { onMount } from "svelte"

  let popularTopics = []

  onMount(async () => {
    const response = await fetch("/api/topics/top")
    if (response.ok) {
      popularTopics = await response.json()
      console.log(popularTopics)
    }
  })
</script>

<div class="topics-container">
  {#if popularTopics.length > 0}
    {#each popularTopics as topic}
      <div class="topic-container">
        <p class="topic-title">{topic.topic.title}</p>
        <div class="bar-container">
          <div
            class="agree-bar"
            style="width: {(topic.agreeCount /
              (topic.agreeCount + topic.disagreeCount)) *
              100}%;"
          />
          <div
            class="disagree-bar"
            style="width: {(topic.disagreeCount /
              (topic.agreeCount + topic.disagreeCount)) *
              100}%;"
          />
        </div>
        <div class="vote-counts">
          <span>👍 {topic.agreeCount}</span>
          <span>👎 {topic.disagreeCount}</span>
        </div>
      </div>
    {/each}
  {:else}
    <p>No topics found.</p>
  {/if}
</div>

<style>
  .topics-container {
    max-width: 800px; /* or whatever width you prefer */
    margin: 0 auto; /* centers the container */
    padding: 20px; /* gives some space on the sides */
  }

  .topic-container {
    margin-bottom: 30px;
    padding: 10px 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  }

  .topic-title {
    margin-bottom: 10px;
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
  }

  .bar-container {
    display: flex;
    height: 30px;
    background-color: #f0f0f0;
    border-radius: 5px;
    overflow: hidden; /* This ensures the inner bars also get the rounded edges */
  }

  .agree-bar,
  .disagree-bar {
    transition: width 0.3s ease-in-out;
  }

  .agree-bar {
    background-color: rgba(75, 192, 192, 0.7);
    border-right: 1px solid #e0e0e0; /* subtle separator */
  }

  .disagree-bar {
    background-color: rgba(255, 99, 132, 0.7);
  }

  .vote-counts {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 0.9rem;
    color: #555;
  }

  .vote-counts span:hover {
    color: #333;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
