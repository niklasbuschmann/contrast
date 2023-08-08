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
    font-size: 12px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
  }

  .correct-answer {
    background-color: #28a745;
  }

  .incorrect-answer {
    background-color: #dc3545;
  }
</style>

<div id="loading">Loading...</div>

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

  function startGame() {
    var chosenStatements = [];

    // Select 2 random truths
    while (chosenStatements.length < 2) {
      var randomTruth = truths[Math.floor(Math.random() * truths.length)];
      if (!chosenStatements.some(s => s.statement === randomTruth)) {
        chosenStatements.push({ statement: randomTruth, isLie: false });
      }
    }

    // Select 1 random lie
    chosenStatements.push({ statement: lies[Math.floor(Math.random() * lies.length)], isLie: true });

    // Shuffle the statements
    chosenStatements.sort(() => Math.random() - 0.5);

    var html = chosenStatements.map((s, index) => `<button class="statement-button" onclick="checkAnswer(${index})">${s.statement}</button>`).join('<br>');
    document.getElementById("statements").innerHTML = html;

    window.chosenStatements = chosenStatements;

  }

function checkAnswer(index) {
  var buttons = document.querySelectorAll(".statement-button:not(#restart-button)");

  for (var i = 0; i < buttons.length; i++) {
    var statement = window.chosenStatements[i];
    buttons[i].disabled = true;
    buttons[i].classList.add(statement.isLie ? "incorrect-answer" : "correct-answer");
  }

  document.getElementById("restart-button").style.display = "inline-block";
}


  window.onload = startGame;
</script>

<div id="statements"></div>
<button class="statement-button" id="restart-button" onclick="startGame()" style="display:none;">Restart Game</button>


## Your turn! I will Guess

Enter three statements and the AI try to guess which one is a lie.

<div class="input-form">
    <label for="statement1">Statement 1:</label>
    <input type="text" id="statement1" required><br>
    <label for="statement2">Statement 2:</label>
    <input type="text" id="statement2" required><br>
    <label for="statement3">Statement 3:</label>
    <input type="text" id="statement3" required><br><br>
    <button class="statement-button" id="guess-button" onclick="guessLie()" style="display:inline-block;">Guess your lie</button>
</div>
<p id="loading">Loading...</p> 
<p id="result"></p>

<style>
    .input-form {
        margin: 20px 0;
    }
    label, input, button {
        margin-bottom: 10px;
    }
    
    #loading {
        display: none;
        font-size: 16px;
        margin-top: 10px;
    }
</style>

<script>
  async function guessLie() {
    const statement1 = document.getElementById("statement1").value;
    const statement2 = document.getElementById("statement2").value;
    const statement3 = document.getElementById("statement3").value;

    const queryParams = new URLSearchParams({
      statement1: statement1,
      statement2: statement2,
      statement3: statement3,
    });

    // Show the loading indicator while fetching the response
    var loadingIndicator = document.getElementById("loading");
    loadingIndicator.style.display = "block";

    try {
      const response = await fetch(`https://guess-lie.vercel.app/api/guess-lie?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Hide the loading indicator after fetching the response
      loadingIndicator.style.display = "none";

      const result = await response.json();
      document.getElementById("result").innerHTML = result.lieGuess;
    } catch (error) {
      console.error("There was an error:", error);
      document.getElementById("result").innerHTML =
        "Sorry, something went wrong. Please try again later.";
      loadingIndicator.style.display = "none"; // Hide the loading indicator if an error occurs
    }
  }
</script>
