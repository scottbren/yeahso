<script>
    let topicTitle = '';
    let topicDescription = '';

    const submitTopic = async () => {
    if (topicDescription.trim()) {
        try {
            const response = await fetch('/api/topics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: topicDescription,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result); // Handle success, maybe navigate to the created topic or show a success message
            } else {
                const error = await response.json();
                console.error(error.message || 'Error submitting topic');
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }
};

</script>

<div class="swiper">
    <div class="topic-card">
        <p>Submit a conspiracy theory</p>
    </div>
    <div class="form-container">

        <div class="form-group">
            <textarea id="topicDescription" bind:value={topicDescription} class="input-field"></textarea>
        </div>

        <button on:click={submitTopic} class="submit-btn">Post ($5)</button>
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
        padding: 30px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
    }

    .form-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 80%;
        max-width: 800px;
        background-color: var(--background-color);
        padding: 20px;
        border-radius: 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
    }

    .input-field {
        padding: 10px 20px;
        padding-bottom: 250px;
        font-size: 1em;
        border: none; /* Remove the border */
        border-radius: 20px;
        background: rgba(0,0,0,0.2); /* Slight transparency */
        color: var(--gradient-start);
        transition: var(--transition-speed);
        width: 100%;
        box-sizing: border-box;
    }

    .input-field:focus {
        outline: none;
        background: rgba(0,0,0,0.1); /* Darker background on focus */
        box-shadow: 0 0 5px var(--gradient-end);
    }

    .submit-btn {
        padding: 10px 30px;
        font-size: 1.2em; /* Slightly larger font size */
        color: var(--background-color);
        background: linear-gradient(to right, var(--gradient-start), var(--gradient-end));
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: var(--transition-speed);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        align-self: center; /* Center the button */
    }

    .submit-btn:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
</style>
