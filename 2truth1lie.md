---
title: "2 Truths 1 Lie"
permalink: "/2truth1lie/"
layout: page
---

Here are my statements. Pick which one you think is the truth.

<script type="text/javascript">
  // Define your truths and lies here
  var truths = ["I have been to Mars.", "I can speak five languages.", /* Add more truths here */];
  var lies = ["I am a robot.", "I can fly.", /* Add more lies here */];

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
    var html = statements.map((s, index) => `<button onclick="checkAnswer(${index})">${s}</button>`).join('<br>');
    document.getElementById("statements").innerHTML = html;
  }

  // Function to check the answer
  function checkAnswer(index) {
    if (index < 2) {
      alert("Correct! That's a truth.");
    } else {
      alert("Sorry, that's a lie.");
    }
  }

  // Start the game when the page loads
  window.onload = startGame;
</script>

<div id="statements"></div>
