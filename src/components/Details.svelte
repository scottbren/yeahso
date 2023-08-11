<script>
    let topic = "Cats are better than dogs?";
    let itemsAgree = ["User1", "User3", "User5"];
    let itemsDisagree = ["User2", "User4"];
  </script>
  
  <div class="swiper">
    <div class="topic-card red-orange-gradient">
      <p>{topic}</p>
    </div>
    <div class="columns-container">
      <div class="disagree-column column">
        <h3>Disagree</h3>
        {#each itemsDisagree as user}
          <div class="card red-orange-gradient">
            <p>{user}</p>
          </div>
        {/each}
      </div>
      <div class="agree-column column">
        <h3>Agree</h3>
        {#each itemsAgree as user}
          <div class="card red-orange-gradient">
            <p>{user}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <style>
    :root {
      --main-bg-color: rgb(54, 54, 54);;
      --container-width: 600px;
      --card-width: 200px;
      --card-bg-gradient: linear-gradient(to bottom right, red, orange);
    }

  
    * {
        box-sizing: border-box; /* Ensures padding and borders are included in width/height calculations */
    }

    .swiper {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh; 
        overflow: hidden; 
        padding: 0;
        margin: 0;
    }
    
    .topic-card {
      width: var(--container-width);
      height: 150px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5em;
      background: var(--card-bg-gradient);
      color: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
      margin-bottom: 20px; /* To account for the gap */
    }
  
    .topic-card:hover {
      transform: translateY(-5px);
    }
  

    .columns-container {
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        gap: 20px;
        width: var(--container-width);
        height: calc(100vh - 170px); /* Adjusting for topic-card height, its margin, and padding of swiper */
        padding: 20px;
        border-radius: 10px;
        background-color: var(--main-bg-color);
    }
        
    .column {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: var(--card-width);
    }
  
    .column h3 {
      font-size: 1.3em;
      margin-bottom: 10px;
    }
  
    .card {
      border-radius: 25px;
      padding: 10px;
      background: var(--card-bg-gradient);
      color: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }
  
    .card:hover {
      transform: translateY(-5px);
    }
  </style>
  