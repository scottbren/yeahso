<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    function navigateToApp() {
      goto('/auth/signin');
    }
    
</script>


<div class="container">
    <div class="content">
        <h1><span class="brand">Yeahso</span></h1>
        <p>The modern platform for debating conspiracy theories. Discover, engage, and voice your opinions.</p>
        <button on:click={navigateToApp}>Get Started</button>
    </div>
</div>

<style>
    :root {
        --background-color: #2B2632;
        --gradient-start: #D23D58;
        --gradient-end: #FFD53F;
        --transition-speed: 0.3s;
    }
    
    body, h1, p, button {
        font-family: 'Jockey One', sans-serif; /* Introduced a more modern font */
        margin: 0;
        padding: 0;
    }
    
    body {
        background-color: var(--background-color);
        background-image: radial-gradient(circle at top left, rgba(255,255,255,0.05), transparent); /* Slight background texture */
    }
    
    .container {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    
    .content {
        max-width: 650px;
        text-align: center;
        padding: 40px;
        background: linear-gradient(to right, var(--gradient-start), var(--gradient-end));
        border-radius: 15px;
        color: var(--background-color);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1); /* Added shadow for depth */
        margin-bottom: 300px;
    }
    
    h1 {
        font-size: 3rem;
        margin-bottom: 20px;
        font-weight: bold;
    }
    
    p {
        font-size: 1.4rem;
        margin-bottom: 50px;
        line-height: 1.6; /* Improved readability */
    }
    
    .brand {
        transition: color var(--transition-speed);
    }
    
    /* Button Styling */
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
    
    button:focus {
        box-shadow: 0 0 5px var(--gradient-start);
    }
    
    </style>
    
