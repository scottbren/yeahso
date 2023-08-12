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
body, h1, p {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    color: #929292;
}

.container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #ff6b6b, #ffad5e);
    padding-bottom: 350px;
}

.content {
    max-width: 600px;
    text-align: center;
    padding: 20px;
    background: #333;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

.brand {
    color: orange;
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
    background-color: orange;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.2s;
}

button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
}
</style>
