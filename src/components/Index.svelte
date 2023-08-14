<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    function navigateToApp() {
      goto('/auth/signin');
    }


    // Function to generate random values
    function getRandomValue(min, max) {
        return Math.random() * (max - min) + min;
    }
    function generateRandomBinary(length) {
        let binaryString = '';
        for (let i = 0; i < length; i++) {
        binaryString += Math.random() < 0.5 ? '0' : '1';
        }
        return binaryString;
    }

</script>


<div class="matrix">
    {#each Array.from({ length: 1000 }) as _, index}
        <div class="matrix-line" style="top: {getRandomValue(0, 100)}%">
            {generateRandomBinary(1000)} <!-- Longer binary strings -->
        </div>
    {/each}
</div>

<div class="container">
    <div class="content">
        <h1><span class="brand">Yeahso</span></h1>
        <p>The modern platform for debating conspiracy theories. Discover, engage, and voice your opinions.</p>
        <button on:click={navigateToApp}>Get Started</button>
    </div>

</div>



<style>
:root {
    --neon-green: #21f034;
    --dark-bg: #000;
    --transition-speed: 0.3s;
}

/* BASE STYLES */
body, h1, p {
    margin: 0;
    padding: 0;
    font-family: 'Courier New', Courier, monospace;
    color: var(--neon-green);
    font-weight: normal;
    animation: flicker 3s infinite;
}

/* CONTAINER STYLES */
.container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(145deg, transparent, transparent), rgba(0, 0, 0, 0.8);    overflow: hidden;
    position: relative;
    padding-bottom: 300px;
    
    
    
}

.container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(33, 240, 52, 0.05) 2px, rgba(33, 240, 52, 0.05) 3px);
    pointer-events: none;
    animation: scanline 0.5s linear infinite;
}

.content {
    max-width: 600px;
    text-align: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.7); /* 80% opaque so that matrix effect is visible behind */
    border-radius: 10px;
    border: 2px solid var(--neon-green);
    box-shadow: 0 0 10px var(--neon-green), 0 0 30px var(--neon-green);
    
}

/* TEXT STYLES */
h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
}

p {
    font-size: 1.2rem;
    margin-bottom: 40px;
}

.brand {
    color: var(--neon-green);
    font-weight: bold;
    transition: color var(--transition-speed);
}

.brand:hover {
    color: var(--dark-bg);
    background-color: var(--neon-green);
    padding: 2px 4px;
}

/* BUTTON STYLES */
button {
    padding: 12px 30px;
    font-size: 1.1rem;
    background-color: var(--dark-bg);
    color: var(--neon-green);
    border: 2px solid var(--neon-green);
    border-radius: 5px;
    cursor: pointer;
    box-shadow: none;
    transition: background-color var(--transition-speed), transform var(--transition-speed);
    outline: none;
}

button:hover {
    background-color: var(--neon-green);
    color: var(--dark-bg);
    transform: translateY(-2px);
}

button:focus {
    box-shadow: 0 0 5px var(--neon-green);
}

/* MATRIX EFFECT STYLES */
.matrix {
    position: absolute;
    left: 0;
    width: 100vw;
    height: 100vh;
    color: var(--neon-green);
    z-index: 0; /* Make it sit behind your content */
    animation: matrixFall 5s linear infinite;

}

.matrix .matrix-line {
    animation: matrixFall infinite; /* Ensure it keeps looping */
}


/* ANIMATIONS */
@keyframes scanline {
    0% {
        background-position: 0 -100%;
    }
    100% {
        background-position: 0 100%;
    }
}

@keyframes flicker {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.9;
    }
}

@keyframes type {
    from {
        width: 0;
    }
    to {
        width: 50ch;
    }
}

@keyframes blink {
    from, to {
        border-color: transparent;
    }
    50% {
        border-color: var(--neon-green);
    }
}

@keyframes fall {
    to {
        transform: translateY(100vh);
    }
}

@keyframes matrixFall {
    0% {
        transform: translateY(-100%);
    }
    100% {
        transform: translateY(0%);
    }
}




</style>
    
