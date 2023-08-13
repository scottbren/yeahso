<script>
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
        opacity: 0.8;
      }
    }
    
    body, h1, p {
        margin: 0;
        padding: 0;
        font-family: 'Courier New', Courier, monospace;
        color: #21f034;
        font-weight: normal;
        animation: flicker 3s infinite;
    }
    
    .container {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 350px;
        background: #000;
        overflow: hidden;
        position: relative;
        border-radius: 2% / 5%;  /* CRT curvature */
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
        background: #000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        border: 2px solid #21f034;
    }
    
    .brand {
        color: #21f034;
        font-weight: bold;
    }
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 20px;
    }
    
    p {
        font-size: 1.2rem;
        margin-bottom: 40px;
    }
    
    button {
        padding: 12px 30px;
        font-size: 1.1rem;
        background-color: #000;
        color: #21f034;
        border: 2px solid #21f034;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: none;
        transition: background-color 0.3s, transform 0.2s;
    }
    
    button:hover {
        background-color: #21f034;
        color: #000;
        transform: translateY(-2px);
    }
    </style>
    
