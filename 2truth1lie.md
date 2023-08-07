---
title: "2 Truths 1 Lie"
permalink: "/2truth1lie/"
layout: page
---

<style>
  .statement-button {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
  }

  .statement-button:hover {
    background-color: #0056b3;
  }

  #result-modal {
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    background-color: #222;
    color: #fff;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 30%;
    text-align: center;
  }
</style>

Which one is the lie?

<script type="text/javascript">
  // Define your truths and lies here
  var truths = [
    "My favourite KDrama is Business Proposal", 
    "I learned how to juggle accidentally",
    "I almost fell off a roller coaster",
    "I once tuned my piano with chopsticks",
    "I have a family of amongus plushies",
    "I've never eaten pasta while visiting Italy",
    "I've experienced sleep paralysis",
    "I had a positive experience with chef's plate",
    "I've held a snake in my hands",
    "I can circular breathe",
    "My favourite video game is It Takes Two",
    "I've never dyed my hair, got a tattoo or a piercing"
  ];
  var lies = [
    "I let my plant die despite being fake",
    "I've solved a puzzle consisting of only white pieces",
    "My bike was stolen on christmas eve",
    "I've grown an 80 kg pumpkin in my backyard",
    "I rode llama when I was 6",
    "I'm a clarinet player in my band",
    "My favourite movie is The Godfather",
    "I used to have long hair",
    "I've been saved a lifeguard before"
  ];

  // Function to start the game
  function startGame() {
    var chosenTruths = [];
    var chosenLies = [];

    // Select 2 random truths
    while (chosenTruths.length < 2) {
      var randomTruth = truths[Math.floor(Math.random() * truths.length)];
      if (!chosenTruths.includes(randomTruth)) {
        chosenTruths.push(randomTruth);
      }
    }

    // Select 1 random lie
    chosenLies.push(lies[Math.floor(Math.random() * lies.length)]);

    // Combine and shuffle the statements
    var statements = chosenTruths.concat(chosenLies);
    statements.sort(() => Math.random() - 0.5);

    // Display the statements
    var html = statements.map((s, index) => `<button class="statement-button" onclick="checkAnswer(${index})">${s}</button>`).join('<br>');
    document.getElementById("statements").innerHTML = html;
  }

  // Function to check the answer
  function checkAnswer(index) {
    var message = index < 2 ? "Correct! That's the lie" : "Incorrect - That is true!";
    document.getElementById("result-message").innerText = message;
    document.getElementById("result-modal").style.display = "block";
  }

  // Close the result modal
  function closeModal() {
    document.getElementById("result-modal").style.display = "none";
  }

  // Start the game when the page loads
  window.onload = startGame;
</script>

<div id="statements"></div>

<!-- Result modal -->
<div id="result-modal">
  <div class="modal-content">
    <p id="result-message"></p>
    <button class="statement-button" onclick="closeModal()">Close</button>
  </div>
</div>



## Your turn

Enter three statements below and I'll try to guess which one is a lie.

<div class="input-form">
    <label for="statement1">Statement 1:</label>
    <input type="text" id="statement1" required><br>
    <label for="statement2">Statement 2:</label>
    <input type="text" id="statement2" required><br>
    <label for="statement3">Statement 3:</label>
    <input type="text" id="statement3" required><br><br>
    <button onclick="guessLie()">Guess the Lie</button>
</div>
<p id="result"></p>

<style>
    .input-form {
        margin: 20px 0;
    }
    label, input, button {
        margin-bottom: 10px;
    }
</style>

<script>
    async function guessLie() {
        const statement1 = document.getElementById('statement1').value;
        const statement2 = document.getElementById('statement2').value;
        const statement3 = document.getElementById('statement3').value;
        
        const prompt = `Given the following statements in a game of 2 Truths 1 Lie identify which one is a lie:\n1. ${statement1}\n2. ${statement2}\n3. ${statement3}`;

        try {
            const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer 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`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    max_tokens: 50
                })
            });

            const result = await response.json();
            document.getElementById('result').innerHTML = `I guess that the lie is: ${result.choices[0].text.trim()}`;
        } catch (error) {
            console.error("There was an error:", error);
            document.getElementById('result').innerHTML = "Sorry, something went wrong. Please try again later.";
        }
    }
</script>